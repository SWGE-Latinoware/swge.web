import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CustomDialog from '../custom-dialog/CustomDialog';
import EditInstitution from '../../pages/institutions/edit-institution/EditInstitution';
import UserList from '../../pages/users/list-users/UserList';
import EditCertificate from '../../pages/certificates/edit-certificate/EditCertificate';
import EditTrack from '../../pages/tracks/edit-track/EditTrack';
import EditUser from '../../pages/users/edit-user/EditUser';

export const EDIT_INSTITUTION = 'INSTITUTION';
export const EDIT_USER = 'EDIT_USER';
export const EDIT_CERTIFICATE = 'EDIT_CERTIFICATE';
export const EDIT_TRACK = 'EDIT_TRACK';
export const USER_LIST = 'USER_LIST';

const FormDialog = (props) => {
  const { link, linkProps, openDialog, setOpenDialog } = props;
  const { t } = useTranslation();

  const LLink = useMemo(() => {
    switch (link) {
      case EDIT_INSTITUTION:
        return EditInstitution;
      case EDIT_USER:
        return EditUser;
      case USER_LIST:
        return UserList;
      case EDIT_CERTIFICATE:
        return EditCertificate;
      case EDIT_TRACK:
        return EditTrack;
      default:
        return null;
    }
  }, [link]);

  const title = useMemo(() => {
    switch (link) {
      case EDIT_INSTITUTION:
        return t(`pages.editInstitution.toolbar.${linkProps.id ? 'editInstitution' : 'newInstitution'}`);
      case EDIT_USER:
        return t(`pages.editUser.toolbar.${linkProps.id ? 'editUser' : 'newUser'}`);
      case USER_LIST:
        return t(`pages.userList.toolbar.title`);
      case EDIT_CERTIFICATE:
        return t(`pages.editCertificate.toolbar.${linkProps.id ? 'editCertificate' : 'newCertificate'}`);
      case EDIT_TRACK:
        return t(`pages.editTrack.toolbar.${linkProps.id ? 'editTrack' : 'newTrack'}`);
      default:
        return null;
    }
  }, [link, linkProps, t]);

  return (
    <>
      {openDialog && LLink && (
        <CustomDialog
          dialogProps={{ maxWidth: 'lg' }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title={title}
          content={<LLink goBack={() => setOpenDialog(false)} {...linkProps} />}
        />
      )}
    </>
  );
};

export default FormDialog;
