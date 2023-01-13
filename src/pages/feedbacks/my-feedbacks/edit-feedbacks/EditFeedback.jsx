import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import BoxW from '../../../../components/wrapper/BoxW';
import TextFieldW from '../../../../components/wrapper/TextFieldW';
import { useToast } from '../../../../components/context/toast/ToastContext';
import MUIRichTextEditorW from '../../../../components/wrapper/MUIRichTextEditorW';
import FormUtils from '../../../../utils/FormUtils';
import { useUserChange } from '../../../../components/context/UserChangeContext';
import FeedbackService from '../../../../services/FeedbackService';
import FileService from '../../../../services/FileService';
import FileUtils from '../../../../utils/FileUtils';
import DropzoneAreaW from '../../../../components/wrapper/DropzoneAreaW';
import InfoService from '../../../../services/InfoService';
import FormGenerics from '../../../../components/form-generic/FormGenerics';

const EditFeedback = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentUser } = useUserChange();
  const history = useHistory();

  const [uploadFiles, setUploadFiles] = useState(undefined);
  const [descriptionState, setDescriptionState] = useState(undefined);
  const [apiVersion, setApiVersion] = useState(null);

  const webVersion = process.env.REACT_APP_VERSION;

  const schema = yup.object().shape({
    title: yup.string().required(),
  });

  const { control, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleFilesChange = useCallback(
    (operation) => {
      FileUtils.createZipFile(uploadFiles, (zipblob) => {
        const form = new FormData();
        form.append('name', 'feedback');
        form.append('file', zipblob);
        form.append('format', 'zip');
        FileService.create(form).then((response) => {
          operation(response);
        });
      });
    },
    [uploadFiles]
  );

  useEffect(() => {
    InfoService.getVersion().then((response) => {
      if (response.status === 200) {
        setApiVersion(response.data);
        return;
      }
      setApiVersion(null);
    });
  }, []);

  const handleSave = useCallback(
    (formFeedback) => {
      const form = FormUtils.removeEmptyFields(formFeedback);
      form.user = currentUser;
      form.description = descriptionState;
      form.apiVersion = apiVersion;
      form.webVersion = webVersion;
      const operation = (response) => {
        if (response.status === 200) {
          form.file = response.data;
          FeedbackService.create(form).then((responseAux) => {
            if (responseAux.status === 200) {
              addToast({ body: t('toastes.save'), type: 'success' });
              history.push('/cli/my-feedbacks');
            } else {
              addToast({ body: t('toastes.saveError'), type: 'error' });
            }
          });
          return;
        }
        addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
      };
      if (uploadFiles?.length > 0) {
        handleFilesChange(operation);
        return;
      }
      operation({ status: 200, data: form.file });
    },
    [addToast, apiVersion, currentUser, descriptionState, handleFilesChange, history, t, uploadFiles?.length, webVersion]
  );

  return (
    <FormGenerics
      title={[
        t('layouts.sidebar.feedback'),
        { title: t('layouts.sidebar.myFeedbacks'), url: '/cli/my-feedbacks' },
        t('pages.myFeedbacks.toolbar.title'),
      ]}
      goBack="/cli/my-feedbacks"
      defaultService={FeedbackService}
      handleSubmit={handleSubmit}
      handleExternSave={handleSave}
    >
      <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <BoxW width="100%" p={1}>
          <Controller
            name="title"
            render={({ field }) => <TextFieldW label={t('pages.myFeedbacks.title')} {...field} error={errors?.title} required />}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>
        <BoxW p={1} width="100%">
          <Controller
            name="description"
            render={({ field }) => (
              <MUIRichTextEditorW
                media={false}
                label={t('pages.myFeedbacks.description')}
                defaultValue={field.value}
                setDescriptionState={setDescriptionState}
              />
            )}
            control={control}
          />
        </BoxW>
        <BoxW width="100%" p={1}>
          <DropzoneAreaW filesLimit={5} onChange={(files) => setUploadFiles(files)} />
        </BoxW>
      </BoxW>
    </FormGenerics>
  );
};

export default EditFeedback;
