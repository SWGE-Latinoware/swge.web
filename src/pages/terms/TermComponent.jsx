/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileService from '../../services/FileService';
import { useThemeChange } from '../../components/context/ThemeChangeContext';

const TermComponent = (props) => {
  const { termName, title } = props;
  const { currentTheme } = useThemeChange();

  const [term, setTerm] = useState(null);
  const [auxTerm, setAuxTerm] = useState(null);
  const [height, setHeight] = useState(0);
  const [updateIframe, setUpdateIframe] = useState(false);

  useEffect(() => {
    FileService.getTerm(termName).then((resp) => {
      if (resp.status === 200) {
        setTerm(termName === 'authorization-term' ? `data:application/pdf;base64,${resp.data}` : resp.data);
        if (termName === 'authorization-term') PDFDocument.load(resp.data).then((pdf) => setHeight(pdf.getPage(0).getSize().height));
      } else {
        setTerm(null);
      }
    });
  }, [termName]);

  useEffect(() => {
    if (term) {
      if (termName !== 'authorization-term') {
        const newTerm = term
          .replace(/(--background: .+)/, `--background: ${currentTheme.palette.background.paper};`)
          .replace(
            /(--border-font-color: .+)/,
            `--border-font-color: ${currentTheme.palette.getContrastText(currentTheme.palette.background.paper)};`
          );
        setAuxTerm(newTerm);
        return;
      }
      setAuxTerm(term);
    }
  }, [currentTheme.palette, term, termName]);

  useEffect(() => {
    if (term && auxTerm && updateIframe && termName !== 'authorization-term') {
      const iframe = document.getElementById('term');
      if (iframe) {
        iframe.height = `${iframe.contentWindow.document.body.scrollHeight}px`;
        setUpdateIframe(false);
      }
    }
    if (termName === 'authorization-term') {
      setUpdateIframe(false);
    }
  }, [auxTerm, height, term, termName, updateIframe]);

  return (
    <>
      {auxTerm && (
        <iframe
          id="term"
          src={termName === 'authorization-term' && auxTerm}
          srcDoc={termName !== 'authorization-term' && auxTerm}
          height={termName === 'authorization-term' && height - height * 0.075}
          width="100%"
          title={title}
          onLoad={() => setUpdateIframe(true)}
          style={termName !== 'authorization-term' ? { border: 0 } : {}}
        />
      )}
    </>
  );
};

export default TermComponent;
