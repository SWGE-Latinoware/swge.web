import React from 'react';
import { MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Form from '../../../components/form-components/Form';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Selector from '../../../components/form-components/Selector';
import { useToast } from '../../../components/context/toast/ToastContext';
import Toolbar from '../../../components/toolbar/Toolbar';
import ButtonW from '../../../components/wrapper/ButtonW';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import BoxW from '../../../components/wrapper/BoxW';

const EditTag = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const {
    control,
  } = useForm();

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.records'),
          t('layouts.sidebar.tags'),
          t('pages.editTag.toolbar.title'),
        ]}
        hasArrowBack
      />
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard elevation={4}>
          <Form name="editUserForm" onSubmit={() => addToast({ body: t('toastes.save'), type: 'success' })}>
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW width="50%" p={1}>
                <Controller
                  name="name"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.editTag.name')}
                      {...field}
                    />
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="50%" p={1}>
                <Controller
                  name="tagTemplate"
                  render={({ field }) => (
                    <Selector
                      label={t('pages.editTag.tagTemplate')}
                      {...field}
                    >
                      <MenuItem value={0}>Modelo de Etiqueta 1</MenuItem>
                      <MenuItem value={1}>Modelo de Etiqueta 2</MenuItem>
                      <MenuItem value={2}>Modelo de Etiqueta 3</MenuItem>
                    </Selector>
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="50%" p={1}>
                <Controller
                  name="confirmationTemplate"
                  render={({ field }) => (
                    <Selector
                      label={t('pages.editTag.confirmationTemplate')}
                      {...field}
                    >
                      <MenuItem value={0}>Modelo de Etiqueta 1</MenuItem>
                      <MenuItem value={1}>Modelo de Etiqueta 2</MenuItem>
                      <MenuItem value={2}>Modelo de Etiqueta 3</MenuItem>
                    </Selector>
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW display="flex" flexDirection="row" flexWrap="wrap" p={1} width="100%" justifyContent="center">
                <BoxW p={1} width="25%">
                  <ButtonW fullWidth primary type="submit">{t('pages.editTag.save')}</ButtonW>
                </BoxW>
              </BoxW>
            </BoxW>
          </Form>
        </StyledCard>
      </BoxW>
    </>
  );
};

export default EditTag;
