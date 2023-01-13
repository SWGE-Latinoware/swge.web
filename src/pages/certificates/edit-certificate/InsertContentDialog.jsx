import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControlLabel, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Form from '../../../components/form-components/Form';
import FormUtils from '../../../utils/FormUtils';
import CustomColorPicker from '../../../components/custom-color-picker/CustomColorPicker';
import Selector from '../../../components/form-components/Selector';
import AvailableFonts from '../../../enums/AvailableFonts';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import { useToast } from '../../../components/context/toast/ToastContext';

const InsertContentDialog = (props) => {
  const { openDialog, setOpenDialog, formData, handleInsert, dataIndex } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [dynamicContent, setDynamicContent] = useState(undefined);
  const [contentAux, setContentAux] = useState(undefined);

  const id = formData?.id;

  const schema = yup.object().shape({
    x: yup.number().required(),
    y: yup.number().required(),
    fontSize: yup.number().integer().min(0).required(),
    content: yup.string().ensure(),
  });

  const { control, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  const { errors } = formState;

  const handleInsertContent = (contentForm) => {
    const form = FormUtils.removeEmptyFields(contentForm);

    if (!form.fontColor) form.fontColor = '#000000';
    if (!dynamicContent || dynamicContent === '<p><br></p>') {
      addToast({ body: t('toastes.fetchError'), type: 'error' });
      return;
    }

    form.content = dynamicContent.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('&nbsp;', '');
    handleInsert(form, dataIndex);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (id && formData && formData?.content) {
      const contentHTML = convertFromHTML(formData.content);
      const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
      const result = convertToRaw(state);
      setDynamicContent(result);
      setContentAux(result);
    }
  }, [formData, formData?.content, id]);

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'lg' }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      title={t('pages.editCertificate.insertDialogTitle')}
      buttonText={t('pages.editCertificate.cancelInsertDialog')}
      buttonOnClick={handleSubmit(handleInsertContent)}
      content={
        <Form name="promotionForm" onSubmit={handleSubmit(handleInsertContent)}>
          <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
            {id && (
              <Box width="10%" p={1}>
                <Controller
                  name="id"
                  render={({ field }) => <TextFieldW label={t('pages.editCertificate.id')} {...field} disabled />}
                  defaultValue={id}
                  control={control}
                />
              </Box>
            )}
            <Box width="10%" p={1}>
              <Controller
                name="x"
                render={({ field }) => (
                  <TextFieldW label={t('pages.editCertificate.columns.x')} type="number" {...field} error={errors?.x} required />
                )}
                control={control}
                rules={{ required: true }}
              />
            </Box>
            <Box width="10%" p={1}>
              <Controller
                name="y"
                render={({ field }) => (
                  <TextFieldW label={t('pages.editCertificate.columns.y')} type="number" {...field} error={errors?.y} required />
                )}
                control={control}
                rules={{ required: true }}
              />
            </Box>

            <Box width="15%" p={1}>
              <Controller
                name="fontSize"
                render={({ field }) => (
                  <TextFieldW
                    label={t('pages.editCertificate.columns.fontSize')}
                    type="number"
                    {...field}
                    error={errors?.fontSize}
                    required
                  />
                )}
                defaultValue={12}
                control={control}
                rules={{ required: true }}
              />
            </Box>
            <Box width="30%" p={1}>
              <Controller
                name="fontFamily"
                render={({ field }) => (
                  <Selector label={t('pages.editCertificate.columns.font')} {...field} required>
                    {AvailableFonts.enums.map((item) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <MenuItem key={item.value} value={item.key}>
                        {item.key}
                      </MenuItem>
                    ))}
                  </Selector>
                )}
                defaultValue="Courier"
                control={control}
                rules={{ required: true }}
              />
            </Box>
            <Box width="25%" p={1}>
              <Controller
                name="fontColor"
                render={({ field }) => (
                  <FormControlLabel
                    control={<CustomColorPicker value={field.value} onChange={(color) => field.onChange(color)} />}
                    label={t('pages.editCertificate.columns.color')}
                    labelPlacement="bottom"
                  />
                )}
                defaultValue="#000000"
                control={control}
              />
            </Box>
            <Box width="100%" p={1}>
              {id && contentAux ? (
                <Controller
                  name="content"
                  render={() => (
                    <MUIRichTextEditorW
                      media={false}
                      label={t('pages.editCertificate.columns.content')}
                      defaultValue={contentAux}
                      setDescriptionState={setDynamicContent}
                      controls={['bold', 'italic', 'underline', 'undo', 'redo']}
                      toHtml
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              ) : (
                <Controller
                  name="content"
                  render={({ field }) => (
                    <MUIRichTextEditorW
                      media={false}
                      label={t('pages.editCertificate.columns.content')}
                      defaultValue={field.value}
                      setDescriptionState={setDynamicContent}
                      controls={['bold', 'italic', 'underline', 'undo', 'redo']}
                      toHtml
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              )}
            </Box>
          </Box>
        </Form>
      }
    />
  );
};

export default InsertContentDialog;
