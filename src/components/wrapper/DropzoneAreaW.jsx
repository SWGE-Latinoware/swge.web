import React, { useEffect, useState } from 'react';
import { DropzoneArea } from 'react-mui-dropzone';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { useToast } from '../context/toast/ToastContext';
import FileService from '../../services/FileService';

const DropzoneAreaW = (props) => {
  const { initialFiles, ...otherProps } = props;

  const { t } = useTranslation();
  const { addToast } = useToast();

  const [initialFilesAux, setInitialFilesAux] = useState(undefined);
  const [isReady, setReady] = useState(true);

  useEffect(() => {
    if (initialFiles?.length > 0) {
      setReady(true);
      const promisses = [];
      const formats = {};
      initialFiles.forEach((f) => {
        formats[f.id] = f.format;
        promisses.push(FileService.findOne(f.id));
      });
      Promise.all(promisses).then((responses) => {
        setReady(false);
        if (responses.every((response) => response.status === 200)) {
          setInitialFilesAux(
            responses.map((response) => {
              const id = response.request.responseURL.split('/').at(-1);
              if (formats[id] === 'pdf')
                return new File([new Blob([response.data], { type: `application/pdf;charset=utf-8` })], `${id}.${formats[id]}`, {
                  type: `application/pdf;charset=utf-8`,
                });
              return new File(
                [new Blob([response.data], { type: `image${formats[id] === 'svg' ? '/svg+xml' : ''};charset=utf-8` })],
                `${id}.${formats[id]}`,
                { type: `image${formats[id] === 'svg' ? '/svg+xml' : ''};charset=utf-8` }
              );
            })
          );
          setReady(true);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
        setInitialFilesAux(undefined);
        setReady(true);
      });
      return;
    }
    setReady(true);
  }, [addToast, initialFiles, t]);

  const handlePreviewIcon = (file, classes) => (
    <div className={classes.imageContainer}>
      <Box
        component="svg"
        className={classes.image}
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        {file.data.startsWith('data:application/pdf') ? <PictureAsPdf /> : <image href={file.data} width="100%" height="100%" />}
      </Box>
    </div>
  );

  return isReady ? (
    <DropzoneArea
      initialFiles={initialFilesAux}
      getPreviewIcon={initialFilesAux && handlePreviewIcon}
      acceptedFiles={['image/*']}
      filesLimit={1}
      dropzoneText={t('dropzoneArea.dropzoneText')}
      showPreviewsInDropzone
      previewText={t('dropzoneArea.preview')}
      showAlerts={false}
      onDrop={() => addToast({ body: t('toastes.uploadFile.add'), type: 'success' })}
      onDelete={() => addToast({ body: t('toastes.uploadFile.delete'), type: 'info' })}
      onDropRejected={() => addToast({ body: t('toastes.uploadFile.error'), type: 'error' })}
      {...otherProps}
    />
  ) : (
    <CircularProgress size={70} />
  );
};

export default DropzoneAreaW;
