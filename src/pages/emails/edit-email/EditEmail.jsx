import React, { useState } from 'react';
import { FormControlLabel, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Form from '../../../components/form-components/Form';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Selector from '../../../components/form-components/Selector';
import { useToast } from '../../../components/context/toast/ToastContext';
import Toolbar from '../../../components/toolbar/Toolbar';
import ButtonW from '../../../components/wrapper/ButtonW';
import SwitchW from '../../../components/wrapper/SwitchW';
import ChipAutoComplete from '../../../components/form-components/ChipAutoComplete';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import DatePickerW from '../../../components/wrapper/DatePickerW';
import TimePickerW from '../../../components/wrapper/TimePickerW';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import BoxW from '../../../components/wrapper/BoxW';

const EditEmail = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [emailClass, setEmailClass] = useState(-1);
  const [fromTemplate, setFromTemplate] = useState(-1);
  const [userMode, setUserMode] = useState(-1);
  const [subscriberMode, setSubscriberMode] = useState(-1);

  const {
    control,
  } = useForm();

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.communication'),
          t('layouts.sidebar.emails'),
          t('pages.editEmail.toolbar.title'),
        ]}
        hasArrowBack
      />
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard elevation={4}>
          <Form name="editUserForm" onSubmit={() => addToast({ body: t('toastes.save'), type: 'success' })}>
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW width="65%" p={1}>
                <Controller
                  name="subject"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.editEmail.subject')}
                      {...field}
                    />
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="20%" p={1}>
                <Controller
                  name="class"
                  render={({ field }) => (
                    <Selector
                      label={t('pages.editEmail.class')}
                      {...field}
                      onChange={(e) => setEmailClass(e.target.value)}
                    >
                      <MenuItem value={0}>Usuários</MenuItem>
                      <MenuItem value={1}>Inscritos</MenuItem>
                      <MenuItem value={2}>Caravanas</MenuItem>
                    </Selector>
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="15%" p={1}>
                <FormControlLabel
                  control={(
                    <SwitchW
                      defaultChecked
                      name="enable"
                      size="big"
                      primary
                    />
                      )}
                  label={t('pages.editEmail.enable')}
                  labelPlacement="end"
                />
              </BoxW>
              <BoxW display="flex" flexDirection="row" p={1} width="100%" justifyContent="flex-start">
                {emailClass === 0 && (
                <>
                  <BoxW width="20%" paddingRight={1}>
                    <Controller
                      name="userMode"
                      render={({ field }) => (
                        <Selector
                          label={t('pages.editEmail.userMode')}
                          {...field}
                          onChange={(e) => setUserMode(e.target.value)}
                        >
                          <MenuItem value={0}>Usuários Específicos</MenuItem>
                          <MenuItem value={1}>Tipos de Usuários</MenuItem>
                        </Selector>
                      )}
                      control={control}
                    />
                  </BoxW>
                  {userMode === 0 && (
                  <BoxW width="80%" paddingLeft={1}>
                    <ChipAutoComplete
                      options={[{ name: 'Usuário top' }, { name: 'Usuário xyz' }, { name: 'Usuário 12' }]}
                      label={t('pages.editEmail.selectedUsers')}
                      optionName="name"
                    />
                  </BoxW>
                  )}
                  {userMode === 1 && (
                  <BoxW width="80%" paddingLeft={1}>
                    <ChipAutoComplete
                      options={[{ name: 'Básico' }, { name: 'Administrador' }, { name: 'Coordenador' }]}
                      label={t('pages.editEmail.selectedUserTypes')}
                      optionName="name"
                    />
                  </BoxW>
                  )}
                </>
                )}
                {emailClass === 1 && (
                <>
                  <BoxW width="20%" paddingRight={1}>
                    <Controller
                      name="subscriberMode"
                      render={({ field }) => (
                        <Selector
                          label={t('pages.editEmail.subscriberMode')}
                          {...field}
                          onChange={(e) => setSubscriberMode(e.target.value)}
                        >
                          <MenuItem value={0}>Inscritos Específicos</MenuItem>
                          <MenuItem value={1}>Categoria de Inscritos</MenuItem>
                        </Selector>
                      )}
                      control={control}
                    />
                  </BoxW>
                  {subscriberMode === 0 && (
                  <BoxW width="80%" paddingLeft={1}>
                    <ChipAutoComplete
                      options={[{ name: 'Inscrito top' }, { name: 'Inscrito xyz' }, { name: 'Inscrito 12' }]}
                      label={t('pages.editEmail.selectedSubscribers')}
                      optionName="name"
                    />
                  </BoxW>
                  )}
                  {subscriberMode === 1 && (
                  <BoxW width="25%" paddingLeft={1}>
                    <Controller
                      name="subscriberMode"
                      render={({ field }) => (
                        <Selector
                          label={t('pages.editEmail.selectedSubscriberTypes')}
                          {...field}
                        >
                          <MenuItem value={0}>Todos</MenuItem>
                          <MenuItem value={1}>Apenas Não Pagos</MenuItem>
                          <MenuItem value={2}>Apenas Pagos</MenuItem>
                          <MenuItem value={3}>Apenas Isentos</MenuItem>
                          <MenuItem value={4}>Pagos e Isentos</MenuItem>
                        </Selector>
                      )}
                      control={control}
                    />
                  </BoxW>
                  )}
                </>
                )}
                {emailClass === 2 && (
                <>
                  <BoxW width="70%" paddingRight={1}>
                    <ChipAutoComplete
                      options={[{ name: 'Foz do Iguaçu' }, { name: 'São Carlos' }, { name: 'Bandeirantes' }]}
                      label={t('pages.editEmail.selectedCaravans')}
                      optionName="name"
                    />
                  </BoxW>
                  <BoxW width="30%" paddingLeft={1}>
                    <Controller
                      name="subscriberMode"
                      render={({ field }) => (
                        <Selector
                          label={t('pages.editEmail.selectedRecipients')}
                          {...field}
                        >
                          <MenuItem value={0}>Todos</MenuItem>
                          <MenuItem value={1}>Coordenadores Apenas</MenuItem>
                          <MenuItem value={2}>Inscritos Confirmados</MenuItem>
                          <MenuItem value={3}>Inscritos Não Confirmados</MenuItem>
                        </Selector>
                      )}
                      control={control}
                    />
                  </BoxW>
                </>
                )}
              </BoxW>
              <BoxW width="15%" p={1}>
                <Controller
                  name="fromTemplate"
                  render={({ field }) => (
                    <Selector
                      label={t('pages.editEmail.fromTemplate')}
                      {...field}
                      onChange={(e) => setFromTemplate(e.target.value)}
                    >
                      <MenuItem value={0}>Sim</MenuItem>
                      <MenuItem value={1}>Não</MenuItem>
                    </Selector>
                  )}
                  control={control}
                />
              </BoxW>
              {fromTemplate === 0 && (
              <BoxW width="45%" p={1}>
                <Controller
                  name="templates"
                  render={({ field }) => (
                    <Selector
                      label={t('pages.editEmail.templates')}
                      {...field}
                    >
                      <MenuItem value={0}>Modelo de Email 1</MenuItem>
                      <MenuItem value={1}>Modelo de Email 2</MenuItem>
                      <MenuItem value={2}>Modelo de Email 3</MenuItem>
                    </Selector>
                  )}
                  control={control}
                />
              </BoxW>
              )}
              {fromTemplate === 1 && (
              <BoxW width="100%">
                <MUIRichTextEditorW
                  label="corpo do e-mail"
                />
              </BoxW>
              )}
              <BoxW width="20%" p={1}>
                <Controller
                  name="date"
                  render={({ field }) => (
                    <DatePickerW
                      label={t('pages.editEmail.date')}
                      {...field}
                    />
                  )}
                  control={control}
                  defaultValue={new Date()}
                />
              </BoxW>
              <BoxW width="20%" p={1}>
                <Controller
                  name="time"
                  render={({ field }) => (
                    <TimePickerW
                      label={t('pages.editEmail.time')}
                      {...field}
                    />
                  )}
                  control={control}
                  defaultValue={new Date()}
                />
              </BoxW>
              <BoxW display="flex" flexDirection="row" flexWrap="wrap" p={1} width="100%" justifyContent="center">
                <BoxW p={1} width="25%">
                  <ButtonW fullWidth primary type="submit">{t('pages.editEmail.save')}</ButtonW>
                </BoxW>
              </BoxW>
            </BoxW>
          </Form>
        </StyledCard>
      </BoxW>
    </>
  );
};

export default EditEmail;
