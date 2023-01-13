import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/toast/ToastContext';
import Toolbar from '../toolbar/Toolbar';
import DeleteActionCustomDialog from '../delete-action-custom-dialog/DeleteActionCustomDialog';
import FormUtils from '../../utils/FormUtils';
import BoxW from '../wrapper/BoxW';
import { StyledCard } from '../context/ThemeChangeContext';
import Form from '../form-components/Form';
import ButtonW from '../wrapper/ButtonW';
import UserService from '../../services/UserService';
import { useUserChange } from '../context/UserChangeContext';

const FormGenerics = (props) => {
  const {
    id,
    defaultService,
    goBack,
    title,
    children,
    handleSubmit,
    prepareSave,
    prepareFind,
    disableToolbar,
    handleExternSave,
    onDelete,
  } = props;

  const { addToast } = useToast();
  const { t } = useTranslation();
  const history = useHistory();
  const { isDPO } = useUserChange();
  const { currentUser } = useUserChange();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const [hasExclusion, setHasExclusion] = useState(false);

  const isEditUser = useMemo(() => /\/[0-9]{4}\/cli\/dpo\/user\/[0-9]+/.test(history.location.pathname), [history.location.pathname]);
  const isMyAccount = useMemo(() => /\/[0-9]{4}\/cli\/edit-account/.test(history.location.pathname), [history.location.pathname]);

  const handleDelete = () => {
    setOpenDeleteDialog(false);

    defaultService.deleteOne(id).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.delete'), type: 'success' });
        if (onDelete) onDelete();
        if (goBack) {
          if (typeof goBack === 'string') history.push(goBack);
          else goBack();
        }
        if (defaultService === UserService) {
          setFetchData(true);
        }
      } else {
        addToast({ body: t('toastes.deleteError'), type: 'error' });
      }
    });
  };

  const handleSave = (formGeneric) => {
    if (!prepareSave) return;
    const form = FormUtils.removeEmptyFields(formGeneric);
    if (!prepareSave(form)) return;
    if (id) {
      defaultService.update(form).then((response) => {
        if (response.status === 200) {
          addToast({ body: t('toastes.update'), type: 'success' });
          if (goBack) {
            if (typeof goBack === 'string') history.push(goBack);
            else goBack();
          }
        } else {
          addToast({ body: t('toastes.saveError'), type: 'error' });
        }
      });
      return;
    }
    defaultService.create(form).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.save'), type: 'success' });
        if (goBack) {
          if (typeof goBack === 'string') history.push(goBack);
          else goBack();
        }
      } else {
        addToast({ body: t('toastes.saveError'), type: 'error' });
      }
    });
  };

  const handleCancel = () => {
    if (!fetchData) {
      setFetchData(false);
      setTimeout(() => {
        setFetchData(true);
      }, 10);
    }
  };

  useEffect(() => {
    if (!prepareFind) return;
    if (id && fetchData) {
      setFetchData(false);
      defaultService.findOne(id).then((response) => {
        if (response.status === 200) {
          if (response.data == null || response.data === '') {
            addToast({ body: t('toastes.fetchError'), type: 'error' });
            return;
          }
          prepareFind(response.data);
        } else {
          addToast({ body: t('toastes.fetchError'), type: 'error' });
        }
      });
    }
  }, [addToast, defaultService, id, prepareFind, t, fetchData]);

  useEffect(() => {
    if (openDeleteDialog) return;
    if (isEditUser && isDPO) {
      UserService.findOne(id).then((resp) => {
        if (resp.status === 200) {
          const { exclusionRequests } = resp.data;
          setHasExclusion(
            exclusionRequests.some(
              (exclusionRequest) => exclusionRequest.status === 'NOT_ANALYZED' || exclusionRequest.status === 'APPROVED'
            )
          );
        }
      });
    } else if (isMyAccount) {
      const { exclusionRequests } = currentUser;
      setHasExclusion(
        exclusionRequests.some((exclusionRequest) => exclusionRequest.status === 'NOT_ANALYZED' || exclusionRequest.status === 'APPROVED')
      );
    }
  }, [currentUser, id, isDPO, isEditUser, isMyAccount, openDeleteDialog]);

  return (
    <>
      {!disableToolbar && (
        <>
          <Toolbar title={title} hasArrowBack />
          <DeleteActionCustomDialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            isUserDelete={isMyAccount || (isEditUser && isDPO)}
            service={defaultService}
            id={id}
            buttonErrorOnClick={() => (isMyAccount || (isEditUser && isDPO) ? setOpenDeleteDialog(false) : handleDelete())}
          />
        </>
      )}
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard elevation={disableToolbar ? 0 : 4} p={disableToolbar ? 0 : undefined}>
          <Form onSubmit={handleSubmit(handleExternSave || handleSave)}>
            {children}
            <BoxW display="flex" flexDirection="row" flexWrap="wrap" p={1} width="100%" justifyContent="center" alignItems="center">
              <BoxW p={1} width="25%">
                <ButtonW fullWidth primary type="submit">
                  {t('form.save')}
                </ButtonW>
              </BoxW>
              {!fetchData && (
                <BoxW p={1} width="25%">
                  <ButtonW variant="outlined" color="warning" fullWidth onClick={() => handleCancel()}>
                    {t('form.cancel')}
                  </ButtonW>
                </BoxW>
              )}
              {id && defaultService === UserService && ((isEditUser && isDPO) || isMyAccount) && !hasExclusion && (
                <BoxW p={1} width="25%">
                  <ButtonW fullWidth error onClick={() => setOpenDeleteDialog(true)}>
                    {t(`form.userDelete`)}
                  </ButtonW>
                </BoxW>
              )}
              {id && defaultService !== UserService && (
                <BoxW p={1} width="25%">
                  <ButtonW fullWidth error onClick={() => setOpenDeleteDialog(true)}>
                    {t('form.delete')}
                  </ButtonW>
                </BoxW>
              )}
            </BoxW>
          </Form>
        </StyledCard>
      </BoxW>
    </>
  );
};

export default FormGenerics;
