import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import ButtonW from '../../components/wrapper/ButtonW';
import { useToast } from '../../components/context/toast/ToastContext';
import MUIRichTextEditorW from '../../components/wrapper/MUIRichTextEditorW';
import { StyledCard } from '../../components/context/ThemeChangeContext';
import BoxW from '../../components/wrapper/BoxW';
import Selector from '../../components/form-components/Selector';
import EditionService from '../../services/EditionService';
import { useEditionChange } from '../../components/context/EditionChangeContext';
import FormUtils from '../../utils/FormUtils';
import Form from '../../components/form-components/Form';
import Toolbar from '../../components/toolbar/Toolbar';

const EditHome = () => {
  const { addToast } = useToast();
  const { currentEdition, editionHomes } = useEditionChange();
  const { t, i18n } = useTranslation();
  const [descriptionState, setDescriptionState] = useState(undefined);

  const schema = yup.object().shape({
    language: yup.string().required(),
    edition: yup.object(),
  });

  const { control, handleSubmit, formState, setValue, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      language: i18n.language,
      edition: currentEdition,
    },
  });

  const { errors } = formState;

  const selectedLanguage = watch('language', i18n.language);

  const selectedHomeEdition = useMemo(() => _.find(editionHomes, (o) => o.language === selectedLanguage), [editionHomes, selectedLanguage]);

  useEffect(() => {
    if (selectedHomeEdition?.homeContent) setValue('homeContent', selectedHomeEdition.homeContent);
    else setValue('homeContent', undefined);
  });

  const handleSave = (formGeneric) => {
    const form = FormUtils.removeEmptyFields(formGeneric);
    form.edition = currentEdition;
    form.homeContent = descriptionState;

    if (selectedHomeEdition) {
      form.id = selectedHomeEdition.id;
      EditionService.updateHomeContent(form).then((response) => {
        if (response.status === 200) {
          addToast({ body: t('toastes.update'), type: 'success' });
        } else {
          addToast({ body: t('toastes.saveError'), type: 'error' });
        }
      });
      return;
    }
    EditionService.createHomeContent(form).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.save'), type: 'success' });
      } else {
        addToast({ body: t('toastes.saveError'), type: 'error' });
      }
    });
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.customization'), t('pages.editHome.toolbar.title')]} hasArrowBack />
      <BoxW p={3} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard elevation={4} p={0}>
          <Form name="EditionHomeForm" onSubmit={handleSubmit(handleSave)}>
            <BoxW display="flex" flexDirection="row" flexWrap="wrap" p={2} width="100%" justifyContent="center" alignItems="center">
              <Controller
                name="language"
                render={({ field }) => (
                  <Selector label={t('pages.editHome.language')} {...field} error={errors?.type} required>
                    {Object.keys(t(`enums.languages`, { returnObjects: true })).map((item) => (
                      <MenuItem key={item} value={item}>
                        {t(`enums.languages.${item}`)}
                      </MenuItem>
                    ))}
                  </Selector>
                )}
                control={control}
              />
            </BoxW>
            <BoxW display="flex" flexDirection="row" p={2} width="100%" justifyContent="center">
              <StyledCard p={0} elevation={4}>
                <Controller
                  name="homeContent"
                  render={({ field }) => (
                    <MUIRichTextEditorW
                      media
                      label={t('pages.editHome.content')}
                      defaultValue={field.value}
                      setDescriptionState={setDescriptionState}
                    />
                  )}
                  control={control}
                />
              </StyledCard>
            </BoxW>
            <BoxW display="flex" flexDirection="row" p={1} width="100%" justifyContent="center">
              <BoxW p={1} width="25%">
                <ButtonW fullWidth primary type="submit">
                  {t('pages.editHome.saveChanges')}
                </ButtonW>
              </BoxW>
            </BoxW>
          </Form>
        </StyledCard>
      </BoxW>
    </>
  );
};

export default EditHome;
