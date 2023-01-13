import React, { useCallback, useEffect, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { useTranslation } from 'react-i18next';
import CustomDialog from '../../components/custom-dialog/CustomDialog';
import BoxW from '../../components/wrapper/BoxW';

const PreviewTags = (props) => {
  const { openDialog, setOpenDialog, row, col, pageSize, tags, tagHeight, tagWidth, margin } = props;

  const realToPDFLIB = 2.83466667;

  const { t } = useTranslation();

  const [PDF, setPDF] = useState('');

  const defineFontSize = useCallback(
    (embedBoldFont, embedFont, fontSize, realTagWidth, realTagHeight) => {
      let newFontSize = fontSize;
      tags.forEach((tag) => {
        // eslint-disable-next-line no-nested-ternary
        const city = tag.city ? tag.city : tag.user.city ? tag.user.city : tag.user.country;
        const state = tag.state ? tag.state : tag.user.state;
        while (
          embedBoldFont.widthOfTextAtSize(tag.user.name, newFontSize) > realTagWidth * 0.75 ||
          embedBoldFont.heightAtSize(newFontSize) > realTagHeight * 0.75 ||
          embedFont.widthOfTextAtSize(`${city} - ${state}`, newFontSize - 2) > realTagWidth * 0.65 ||
          embedFont.heightAtSize(newFontSize - 2) > realTagHeight * 0.65
        ) {
          newFontSize -= 1;
          if (newFontSize === 3) break;
        }
      });

      return newFontSize;
    },
    [tags]
  );

  useEffect(() => {
    async function generatePDF() {
      const pageHeight = pageSize[1];
      const realTagWidth = tagWidth * realToPDFLIB;
      const realTagHeight = tagHeight * realToPDFLIB;

      const pdf = await PDFDocument.create();

      const page = pdf.addPage(pageSize);

      const courier = await pdf.embedFont('Courier');
      const courierBold = await pdf.embedFont('Courier-Bold');
      page.setFont(courier);
      page.setFont(courierBold);

      for (let i = 0; i < row; i += 1) {
        for (let j = 0; j < col; j += 1) {
          const x = parseInt(margin.marginLeftRight, 10) + j * parseInt(margin.marginBetweenTagLeftRight, 10) + j * realTagWidth;
          const y =
            pageHeight - i * realTagHeight - parseInt(margin.marginTopBottom, 10) - i * parseInt(margin.marginBetweenTagTopBottom, 10);

          page.drawRectangle({
            x,
            y: y - realTagHeight,
            width: realTagWidth,
            height: realTagHeight,
            borderWidth: 0.1,
            borderColor: rgb(0, 0, 0),
            borderOpacity: 0.1,
          });
        }
      }
      const sizeNow = defineFontSize(courierBold, courier, 128, realTagWidth, realTagHeight);

      tags.forEach((tag) => {
        // eslint-disable-next-line no-nested-ternary
        const city = tag.city ? tag.city : tag.user.city ? tag.user.city : tag.user.country;
        const state = tag.state ? tag.state : tag.user.state;
        const x =
          parseInt(margin.marginLeftRight, 10) +
          tag.colIndex * parseInt(margin.marginBetweenTagLeftRight, 10) +
          tag.colIndex * realTagWidth;
        const y =
          pageHeight -
          tag.rowIndex * realTagHeight -
          parseInt(margin.marginTopBottom, 10) -
          tag.rowIndex * parseInt(margin.marginBetweenTagTopBottom, 10);

        const wordParagraphBold = x + (realTagWidth - courierBold.widthOfTextAtSize(tag.user.tagName, sizeNow)) / 2;
        const wordParagraphNormal = x + (realTagWidth - courier.widthOfTextAtSize(`${city}${state ? `- ${state}` : ''}`, sizeNow - 2)) / 2;

        const wordHeightBold = y - (realTagHeight - courierBold.heightAtSize(sizeNow)) / 2;
        const wordHeightNormal = y - (realTagHeight - courier.heightAtSize(sizeNow - 2)) / 2;

        page.drawText(tag.user.tagName, {
          x: wordParagraphBold,
          y: wordHeightBold,
          size: sizeNow,
          font: courierBold,
          color: rgb(0, 0, 0),
        });
        page.drawText(`${city}${state ? `- ${state}` : ''}`, {
          x: wordParagraphNormal,
          y: wordHeightNormal - courier.heightAtSize(sizeNow),
          size: sizeNow - 2,
          font: courier,
          color: rgb(0, 0, 0),
        });
      });

      pdf.setTitle('Tags');

      await pdf.save().then(async (pdfBytes) => {
        const bytes = new Uint8Array(pdfBytes);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const docUrl = URL.createObjectURL(blob);
        setPDF(docUrl);
      });
    }
    generatePDF();
  }, [
    col,
    defineFontSize,
    margin.marginBetweenTagLeftRight,
    margin.marginBetweenTagTopBottom,
    margin.marginLeftRight,
    margin.marginTopBottom,
    pageSize,
    row,
    tagHeight,
    tagWidth,
    tags,
  ]);

  return (
    <>
      <CustomDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(!openDialog);
        }}
        title={t('pages.tags.previewTags')}
        dialogProps={{ maxWidth: 'md' }}
        content={
          PDF && (
            <BoxW sx={{ width: '100%' }}>
              <iframe src={`${PDF}#zoom=100`} width="100%" height={pageSize[1]} title="Pré-Visualização das Tags" />
            </BoxW>
          )
        }
        buttonErrorText={t('dialog.cancelDeleteDialog')}
      />
    </>
  );
};

export default PreviewTags;
