import React, { useState } from 'react';
import { FormControlLabel, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Selector from '../../../components/form-components/Selector';
import { useToast } from '../../../components/context/toast/ToastContext';
import Toolbar from '../../../components/toolbar/Toolbar';
import ChipAutoComplete from '../../../components/form-components/ChipAutoComplete';
import ButtonW from '../../../components/wrapper/ButtonW';
import SwitchW from '../../../components/wrapper/SwitchW';
import StepperW from '../../../components/wrapper/StepperW';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import DatePickerW from '../../../components/wrapper/DatePickerW';
import TimePickerW from '../../../components/wrapper/TimePickerW';
import { DividerInCard, StyledCard } from '../../../components/context/ThemeChangeContext';
import BoxW from '../../../components/wrapper/BoxW';

const EditSatisfactionSurvey = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [activationOption, setActivationOption] = useState(-1);
  const [targetOption, setTargetOption] = useState(-1);
  const [fromTemplate, setFromTemplate] = useState(-1);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t('pages.editSatisfactionSurvey.step1'),
    t('pages.editSatisfactionSurvey.step2'),
    t('pages.editSatisfactionSurvey.step3'),
  ];

  const {
    control,
  } = useForm();

  const triggers = {
    0: (
      <>
        <BoxW width="20%" p={1}>
          <Controller
            name="date"
            render={({ field }) => (
              <DatePickerW
                label={t('pages.editSatisfactionSurvey.date')}
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
                label={t('pages.editSatisfactionSurvey.time')}
                {...field}
              />
            )}
            control={control}
            defaultValue={new Date()}
          />
        </BoxW>
      </>
    ),
    2: (
      <>
        <BoxW width="30%" p={1}>
          <Controller
            name="condition"
            render={({ field }) => (
              <Selector
                label={t('pages.editSatisfactionSurvey.condition')}
                {...field}
              >
                <MenuItem value={0}>Início</MenuItem>
                <MenuItem value={1}>Fim</MenuItem>
              </Selector>
            )}
            control={control}
          />
        </BoxW>
        <BoxW width="70%" p={1}>
          <Controller
            name="event"
            render={({ field }) => (
              <Selector
                label={t('pages.editSatisfactionSurvey.event')}
                {...field}
              >
                <MenuItem value={0}>Palestra de IOT</MenuItem>
                <MenuItem value={1}>Keynote dia tal</MenuItem>
              </Selector>
            )}
            control={control}
          />
        </BoxW>
      </>
    ),
  };

  const renderTrigger = (option) => {
    switch (option) {
      case -1:
      case 1:
      case 3:
        return <></>;
      default:
        return (
          <>
            <BoxW width="100%" p={1}>
              <DividerInCard variant="middle" />
            </BoxW>
            {triggers[option]}
          </>
        );
    }
  };

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.records'),
          t('layouts.sidebar.satisfactionSurveys'),
          t('pages.editSatisfactionSurvey.toolbar.title'),
        ]}
        hasArrowBack
      />
      <BoxW p={1} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StepperW steps={steps} activeStep={activeStep} />
      </BoxW>
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard elevation={4}>
          {activeStep === 0 && (
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW width="40%" p={1}>
                <Controller
                  name="name"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.editSatisfactionSurvey.name')}
                      {...field}
                    />
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="42%" p={1}>
                <Controller
                  name="url"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.editSatisfactionSurvey.url')}
                      {...field}
                    />
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="18%" p={1}>
                <FormControlLabel
                  control={(
                    <SwitchW
                      defaultChecked
                      name="enable"
                      size="big"
                      primary
                    />
                        )}
                  label={t('pages.editSatisfactionSurvey.enable')}
                  labelPlacement="end"
                />
              </BoxW>
            </BoxW>
          )}
          {activeStep === 1 && (
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW width="25%" p={1}>
                <Controller
                  name="activation"
                  render={({ field }) => (
                    <Selector
                      label={t('pages.editSatisfactionSurvey.activation')}
                      {...field}
                      onChange={(e) => setActivationOption(e.target.value)}
                    >
                      <MenuItem value={0}>Data/Hora</MenuItem>
                      <MenuItem value={1}>Evento Geral</MenuItem>
                      <MenuItem value={2}>Evento Específico</MenuItem>
                      <MenuItem value={3}>Nenhum</MenuItem>
                    </Selector>
                  )}
                  control={control}
                />
              </BoxW>
                {activationOption !== -1 && renderTrigger(activationOption)}
                {activationOption !== -1 && activationOption !== 3 && (
                <>
                  <BoxW width="100%" p={1}>
                    <DividerInCard variant="middle" />
                  </BoxW>
                  <BoxW width="30%" p={1}>
                    <Controller
                      name="target"
                      render={({ field }) => (
                        <Selector
                          label={t('pages.editSatisfactionSurvey.target')}
                          {...field}
                          onChange={(e) => setTargetOption(e.target.value)}
                        >
                          <MenuItem value={0}>Todos os Usuários</MenuItem>
                          {activationOption === 2 && <MenuItem value={1}>Participantes do Evento Específico</MenuItem>}
                          <MenuItem value={2}>Lista de Pessoas</MenuItem>
                        </Selector>
                      )}
                      control={control}
                    />
                  </BoxW>
                  {targetOption === 2 && (
                  <BoxW width="100%" p={1}>
                    <ChipAutoComplete
                      options={[{ name: 'Usuário 1' }, { name: 'Usuário xyz' }, { name: 'Usuário 12' }]}
                      label={t('pages.editSatisfactionSurvey.selectedTarget')}
                      optionName="name"
                    />
                  </BoxW>
                  )}
                </>
                )}
            </BoxW>
          )}
          {activeStep === 2 && (
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW display="flex" flexWrap="wrap" flexDirection="row" width="100%" justifyContent="flex-start">
                <BoxW width="100%" p={1}>
                  <Controller
                    name="subject"
                    render={({ field }) => (
                      <TextFieldW
                        label={t('pages.editSatisfactionSurvey.subject')}
                        {...field}
                      />
                    )}
                    control={control}
                  />
                </BoxW>
                <BoxW width="15%" p={1}>
                  <Controller
                    name="fromTemplate"
                    render={({ field }) => (
                      <Selector
                        label={t('pages.editSatisfactionSurvey.fromTemplate')}
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
                        label={t('pages.editSatisfactionSurvey.templates')}
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
                    onSave={() => {}}
                  />
                </BoxW>
                )}
              </BoxW>
            </BoxW>
          )}
        </StyledCard>
        <BoxW width="100%" p={3} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" justifyContent="center">
          {activeStep > 0 && (
          <BoxW p={1} width="20%">
            <ButtonW fullWidth primary onClick={() => setActiveStep(activeStep - 1)}>{t('pages.editSatisfactionSurvey.back')}</ButtonW>
          </BoxW>
          )}
          {activeStep < steps.length - 1 && (
            <BoxW p={1} width="20%">
              <ButtonW fullWidth primary onClick={() => setActiveStep(activeStep + 1)}>{t('pages.editSatisfactionSurvey.next')}</ButtonW>
            </BoxW>
          )}
          {activeStep === steps.length - 1 && (
            <BoxW p={1} width="20%">
              <ButtonW fullWidth primary onClick={() => addToast({ body: t('toastes.save'), type: 'success' })}>{t('pages.editSatisfactionSurvey.save')}</ButtonW>
            </BoxW>
          )}
        </BoxW>
      </BoxW>
    </>
  );
};

export default EditSatisfactionSurvey;
