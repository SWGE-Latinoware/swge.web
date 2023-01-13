import React, { useEffect, useState } from 'react';
import { PageSizes, PDFDocument, PDFName, PDFString, rgb, StandardFonts } from 'pdf-lib';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { Color } from 'colorinterpreter';
import fontkit from '@pdf-lib/fontkit';
import * as pdfjs from 'pdfjs-dist/webpack';
import _ from 'lodash';
import QRCodeSVG from 'qrcode.react';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import BoxW from '../../../components/wrapper/BoxW';

const fontAssetsURL = {
  'Fantasque Sans': 'FantasqueSansMono-',
  Ubuntu: 'Ubuntu-',
  'Apple Storm': 'AppleStorm',
  Roboto: 'Roboto-',
  Lato: 'Lato-',
  Poppins: 'Poppins-',
  'Playfair Display SC': 'PlayfairDisplaySC-',
};

const regexTextTags = /(<[\w-/]+>)/g;
const regexNsBlanks = / +/g;

const PreviewCertificate = (props) => {
  const { certificateTitle, backgroundImg, content, containQrCode } = props;

  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [certificateBackground, setCertificateBackground] = useState(null);
  const [PDF, setPDF] = useState({ content: null, width: 0, height: 0 });
  const [isPNG, setIsPNG] = useState(false);

  const textTags = ['<br>', '<strong>', '</strong>', '<em>', '</em>', '<u>', '</u>'];

  useEffect(() => {
    if (backgroundImg) {
      const reader = new FileReader();
      reader.readAsDataURL(backgroundImg);

      if (backgroundImg.name.endsWith('jpg') || backgroundImg.name.endsWith('jpeg')) {
        setIsPNG(false);
      } else {
        setIsPNG(true);
      }

      reader.onloadend = () => {
        setCertificateBackground(reader.result);
      };
    } else {
      setCertificateBackground(null);
    }
  }, [backgroundImg]);

  const handleFont = (cont) => {
    let font = cont.fontFamily;
    if (cont.fontFamily === 'Times-Roman') {
      font = 'TimesRoman';

      return { embedFont: StandardFonts[`${font}`], newFont: 0 };
    }

    const embedFont = StandardFonts[`${font}`];

    return { cont, embedFont, newFont: embedFont === undefined };
  };

  const handleLink = (cont) => {
    if (cont.fontFamily === 'Ubuntu') return { bold: 'B', italic: 'RI', regular: 'R', etx: '.ttf', boldItalic: 'BI' };
    if (cont.fontFamily === 'Apple Storm') return { bold: 'CBo', italic: 'Ita', regular: 'Rg', etx: '.otf', boldItalic: 'CBoIta' };
    return { bold: 'Bold', italic: 'Italic', regular: 'Regular', etx: '.ttf', boldItalic: 'BoldItalic' };
  };

  const certificate = async () => {
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);

    const linkAnnotation = pdf.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [145, PageSizes.A4[0] / 2 - 5, 358, PageSizes.A4[0] / 2 + 15],
      Border: [0, 0, 2],
      C: [0, 0, 1],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of('https://www.google.com'),
      },
    });
    const linkAnnotationRef = pdf.context.register(linkAnnotation);

    const page = pdf.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
    if (certificateBackground) {
      const pageBackground = isPNG ? await pdf.embedPng(certificateBackground) : await pdf.embedJpg(certificateBackground);

      page.drawImage(pageBackground, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
    }

    if (containQrCode) {
      const qrCodeCanvas = document.querySelector('canvas');
      const qrCodeDataUri = qrCodeCanvas.toDataURL('image/jpeg');

      const qrCodeImg = await pdf.embedJpg(qrCodeDataUri);

      page.drawImage(qrCodeImg, {
        x: 2,
        y: 2,
        width: 100,
        height: 100,
      });
    }

    page.drawText('Link da validação do certificado', {
      x: 2,
      y: PageSizes.A4[0] - 25,
      size: 15,
      color: rgb(0, 0, 1),
    });

    page.node.set(PDFName.of('Annots'), pdf.context.obj([linkAnnotationRef]));

    const resp = await Promise.all(
      content
        .map((cont) => handleFont(cont))
        .filter((cont) => cont.newFont)
        .flatMap(({ cont }) => {
          const { bold, italic, regular, etx, boldItalic } = handleLink(cont);

          const normalUrl = `${fontAssetsURL[cont.fontFamily]}${regular}`;
          const boldUrl = `${fontAssetsURL[cont.fontFamily]}${bold}`;
          const italicUrl = `${fontAssetsURL[cont.fontFamily]}${italic}`;
          const boldItalicUrl = `${fontAssetsURL[cont.fontFamily]}${boldItalic}`;

          return [
            fetch(`/api/fonts?fileName=${normalUrl}${etx}`).then((res) => ({ name: normalUrl, content: res.arrayBuffer() })),
            fetch(`/api/fonts?fileName=${boldUrl}${etx}`).then((res) => ({ name: boldUrl, content: res.arrayBuffer() })),
            fetch(`/api/fonts?fileName=${italicUrl}${etx}`).then((res) => ({ name: italicUrl, content: res.arrayBuffer() })),
            fetch(`/api/fonts?fileName=${boldItalicUrl}${etx}`).then((res) => ({ name: boldItalicUrl, content: res.arrayBuffer() })),
          ];
        })
    );

    const fonts = await Promise.all(resp.map(async ({ content: cont }) => pdf.embedFont(await cont)));

    await Promise.all(
      content.map(async (cont) => {
        const { embedFont, newFont } = handleFont(cont);

        let customFont;
        let boldCustomFont;
        let italicCustomFont;
        let boldItalicCustomFont;

        const color = new Color(cont.fontColor);

        if (newFont) {
          const { bold, italic, regular, boldItalic } = handleLink(cont);

          const normalUrl = `${fontAssetsURL[cont.fontFamily]}${regular}`;
          const boldUrl = `${fontAssetsURL[cont.fontFamily]}${bold}`;
          const italicUrl = `${fontAssetsURL[cont.fontFamily]}${italic}`;
          const boldItalicUrl = `${fontAssetsURL[cont.fontFamily]}${boldItalic}`;

          customFont = fonts.find((obj, index) => normalUrl === resp[index].name);
          boldCustomFont = fonts.find((obj, index) => boldUrl === resp[index].name);
          italicCustomFont = fonts.find((obj, index) => italicUrl === resp[index].name);
          boldItalicCustomFont = fonts.find((obj, index) => boldItalicUrl === resp[index].name);
        } else {
          if (embedFont === 'Times-Roman') {
            boldCustomFont = await pdf.embedFont(`Times-Bold`);
            italicCustomFont = await pdf.embedFont(`Times-Italic`);
            boldItalicCustomFont = await pdf.embedFont(`Times-BoldItalic`);
          } else {
            boldCustomFont = await pdf.embedFont(`${embedFont}-Bold`);
            italicCustomFont = await pdf.embedFont(`${embedFont}-Oblique`);
            boldItalicCustomFont = await pdf.embedFont(`${embedFont}-BoldOblique`);
          }

          customFont = await pdf.embedFont(embedFont);
          page.setFont(customFont);
        }

        const margin = page.getWidth() - cont.x;
        const lineHeight = customFont.heightAtSize(cont.fontSize);

        const texts = [];
        texts[0] = '';
        const words = _.compact(cont.content.split(' ').join('@@@@').split(regexTextTags).join('@@@@').split('@@@@'));

        let wordsIndex = 0;
        words.forEach((word) => {
          const wordWithoutTag = word.replaceAll(regexTextTags, '');
          const newWordWidth = customFont.widthOfTextAtSize(wordWithoutTag, cont.fontSize);
          const oldWordWidth = customFont.widthOfTextAtSize(texts[wordsIndex].replaceAll(regexTextTags, ''), cont.fontSize);

          if (cont.x + oldWordWidth + newWordWidth >= margin || word === '<br>') {
            wordsIndex += 1;
            texts[wordsIndex] = '';
          }
          if (word !== '<br>') texts[wordsIndex] = texts[wordsIndex].concat(` ${word}`);
        });

        let yNow = 0;

        let bold = false;
        let italic = false;
        let underlined = false;
        let selectedFont = customFont;

        texts.forEach((text) => {
          let lineX = cont.x;

          const drawWords = _.compact(text.split(regexTextTags));

          drawWords.forEach(async (printWord, index) => {
            const line = text.replaceAll(regexTextTags, '').trim().replaceAll(regexNsBlanks, ' ');
            const word = printWord.trim();
            const lineIndent = (margin - cont.x - customFont.widthOfTextAtSize(line, cont.fontSize)) / 2;

            if (word !== '') {
              if (word === '<strong>' || word === '</strong>') {
                bold = word === '<strong>';
              } else if (word === '<em>' || word === '</em>') {
                italic = word === '<em>';
              } else if (word === '<u>' || word === '</u>') {
                underlined = word === '<u>';
              } else {
                if (italic && bold) {
                  selectedFont = boldItalicCustomFont;
                } else if (bold) {
                  selectedFont = boldCustomFont;
                } else if (italic) {
                  selectedFont = italicCustomFont;
                } else {
                  selectedFont = customFont;
                }

                page.drawText(word, {
                  x: lineX + (lineIndent > 0 ? lineIndent : 0),
                  y: cont.y - yNow,
                  size: cont.fontSize,
                  font: selectedFont,
                  color: rgb(color.r / 255, color.g / 255, color.b / 255),
                });
              }

              const wordX =
                word !== ','
                  ? selectedFont.widthOfTextAtSize(` ${word}`, cont.fontSize)
                  : selectedFont.widthOfTextAtSize(`${word}`, cont.fontSize);

              if (underlined && !(_.indexOf(textTags, word) !== -1 && index === drawWords.length - 1)) {
                let textWidth = selectedFont.widthOfTextAtSize(word, cont.fontSize) - (word !== ',' && 3);

                if (lineX > cont.x && lineX + lineIndent + textWidth < margin && _.indexOf(textTags, word) !== -1)
                  textWidth = -selectedFont.widthOfTextAtSize(' ', cont.fontSize) + (word !== ',' && 3);
                if (lineX === cont.x && _.indexOf(textTags, word) !== -1) textWidth = 0;

                const underline = `M 0,0 L ${textWidth},0`;
                page.drawSvgPath(underline, {
                  x: lineX + (lineIndent > 0 ? lineIndent : 0) + (word !== ',' && 3),
                  y: cont.y - yNow - 3,
                  borderColor: rgb(color.r / 255, color.g / 255, color.b / 255),
                });
              }

              if (_.indexOf(textTags, word) === -1) {
                lineX += wordX;
              }
            }
          });

          yNow += lineHeight + 5;
        });
      })
    );

    pdf.setTitle(certificateTitle);

    await pdf.save().then(async (pdfBytes) => {
      const pdfImg = await pdfjs.getDocument(pdfBytes).promise;
      const canvas = document.createElement('canvas');
      const pageImg = await pdfImg.getPage(1);
      const viewport = (await pageImg).getViewport({ scale: 1 });
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await pageImg.render({ canvasContext, viewport }).promise;
      setPDF({ content: canvas.toDataURL(), height: canvas.height, width: canvas.width });
      canvas.remove();
    });
  };

  return (
    <>
      <CustomDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(!openDialog);
        }}
        title={t('pages.editCertificate.certificatePreview')}
        dialogProps={{ maxWidth: 'md' }}
        content={
          PDF && (
            <BoxW sx={{ width: PDF.width, height: PDF.height }}>
              <iframe src={PDF.content} width={PDF.width} height={PDF.height} title={`Pré-Visualização do ${certificateTitle}`} />
            </BoxW>
          )
        }
        buttonErrorText={t('dialog.cancelDeleteDialog')}
      />
      <BoxW sx={{ display: 'none' }} className="hiddenCanvas">
        <QRCodeSVG value="www.google.com" includeMargin size={128} bgColor="#FFFFFF" fgColor="#000000" level="L" />
      </BoxW>
      <IconButton
        onClick={() => {
          certificate().then(() => setOpenDialog(true));
        }}
      >
        <PictureAsPdf />
      </IconButton>
    </>
  );
};

export default PreviewCertificate;
