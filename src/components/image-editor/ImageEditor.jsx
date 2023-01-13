import { Badge, FormControlLabel, IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Avatar from '@mui/material/Avatar';
import React, { useMemo, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useTranslation } from 'react-i18next';
import BoxW from '../wrapper/BoxW';
import DropzoneAreaW from '../wrapper/DropzoneAreaW';
import SliderW from '../wrapper/SliderW';
import CustomDialog from '../custom-dialog/CustomDialog';
import { useToast } from '../context/toast/ToastContext';
import { useUserChange } from '../context/UserChangeContext';

const ImageEditor = (props) => {
  const { userImage, setUserImage, userEditImage, setUserEditImage } = props;

  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentUser } = useUserChange();

  const userColor = useMemo(() => Math.random().toString(16).substr(-6), []);

  const editorRef = useRef(null);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [userUploadedImage, setUserUploadedImage] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const handleUserUploadImage = () => {
    if (userUploadedImage) {
      setUserUploadedImage(false);
      return;
    }
    setOpenUploadDialog(false);
  };

  const handleUserSelectedImage = ([file]) => {
    if (file != null) {
      if (file.size > 10485760) {
        addToast({ body: t('toastes.uploadFile.fileSizeError'), type: 'error' });
        return;
      }

      setUserUploadedImage(true);
      setUserEditImage(file);
    }
  };

  const handleUserEditedImage = () => {
    const imageDataURL = editorRef.current.getImage().toDataURL();
    setUserImage(imageDataURL);
    setOpenUploadDialog(false);
    setUserUploadedImage(false);

    fetch(imageDataURL)
      .then((res) => res.blob())
      .then((blob) => {
        addToast({ body: t('toastes.userProfileSave'), type: 'warning' });
        setUserEditImage(new File([blob], userEditImage.name));
      });
  };

  const handleUserRemoveImage = () => {
    setUserImage(null);
    setOpenUploadDialog(false);
    setUserUploadedImage(false);

    addToast({ body: t('toastes.userRemovedImage'), type: 'warning' });
    setUserEditImage(null);
  };

  return (
    <>
      <CustomDialog
        open={openUploadDialog}
        onClose={() => {
          setOpenUploadDialog(!openUploadDialog);
          setUserUploadedImage(false);
        }}
        buttonOnClick={() => handleUserEditedImage()}
        buttonErrorOnClick={() => handleUserUploadImage()}
        buttonOtherActionOnClick={() => userImage && handleUserRemoveImage()}
        title={t('pages.myAccount.changeUserImageTitle')}
        dialogProps={{ maxWidth: 'md' }}
        content={
          <BoxW width="100%" height="100%" display="flex" flexWrap="wrap">
            {!userUploadedImage ? (
              <DropzoneAreaW width={250} height={250} onChange={(file) => handleUserSelectedImage(file)} />
            ) : (
              <>
                <BoxW width="100%" justifyContent="center" display="flex">
                  <AvatarEditor
                    ref={editorRef}
                    image={userEditImage}
                    width={400}
                    height={400}
                    border={50}
                    color={[0, 0, 0, 0.4]}
                    scale={imageScale}
                    rotate={imageRotation}
                    borderRadius={500}
                    disableBoundaryChecks
                  />
                </BoxW>
                <BoxW width="100%" p={1} justifyContent="center" display="flex">
                  <FormControlLabel
                    sx={{ width: '90%', marginLeft: '0px' }}
                    control={
                      <BoxW width="100%" p={1}>
                        <SliderW min={0.1} max={5.0} defaultValue={1.0} step={0.1} onChange={(event, value) => setImageScale(value)} />
                      </BoxW>
                    }
                    label={t('pages.myAccount.sliderScale')}
                    labelPlacement="bottom"
                  />
                </BoxW>
                <BoxW width="100%" p={1} justifyContent="center" display="flex">
                  <FormControlLabel
                    sx={{ width: '90%', marginLeft: '0px' }}
                    control={
                      <BoxW width="100%" p={1}>
                        <SliderW min={0} max={360} defaultValue={0} step={10} onChange={(event, value) => setImageRotation(value)} />
                      </BoxW>
                    }
                    label={t('pages.myAccount.sliderRotation')}
                    labelPlacement="bottom"
                  />
                </BoxW>
              </>
            )}
          </BoxW>
        }
        buttonText={t('pages.myAccount.changeUserImage')}
        buttonOtherActionText={userImage && t('pages.myAccount.removeUserImage')}
        buttonErrorText={!userUploadedImage ? t('dialog.cancelDeleteDialog') : t('pages.myAccount.goBack')}
      />
      <BoxW minWidth="150px" p={1} minHeight="150px">
        <IconButton onClick={() => setOpenUploadDialog(true)} sx={{ minWidth: '150px', minHeight: '150px' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{ width: '100%', minHeight: '150px', minWidth: '150px' }}
            badgeContent={
              <FileUploadIcon
                sx={(theme) => ({
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.getContrastText(theme.palette.primary.main),
                  borderRadius: 50,
                  fontSize: 40,
                })}
              />
            }
          >
            <Avatar
              sx={{ bgcolor: `#${userColor}`, width: '100%', minHeight: '150px', minWidth: '150px', fontSize: 40 }}
              alt={currentUser?.name}
              src={userImage}
            />
          </Badge>
        </IconButton>
      </BoxW>
    </>
  );
};

export default ImageEditor;
