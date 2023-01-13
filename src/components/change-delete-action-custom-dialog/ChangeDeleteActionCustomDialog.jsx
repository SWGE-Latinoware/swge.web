import React from 'react';
import CancelDeleteActionCustomDialog from '../cancel-delete-action-custom-dialog/CancelDeleteActionCustomDialog';
import DPOManageExclusionActionCustomDialog from '../dpo-manage-exclusion-dialog/DPOManageExclusionActionCustomDialog';

const ChangeDeleteActionCustomDialog = (props) => {
  const { cancelDelete, deleteUser, open, onClose, id } = props;

  return (
    <>
      {cancelDelete ? (
        <CancelDeleteActionCustomDialog open={open} onClose={onClose} buttonOnClick={cancelDelete} />
      ) : (
        <DPOManageExclusionActionCustomDialog open={open} onClose={onClose} buttonOnClick={deleteUser} id={id} />
      )}
    </>
  );
};

export default ChangeDeleteActionCustomDialog;
