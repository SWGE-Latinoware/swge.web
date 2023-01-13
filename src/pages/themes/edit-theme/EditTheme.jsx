import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormControlLabel, IconButton, MenuItem, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { CloudDownload, CloudUpload } from '@mui/icons-material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useParams } from 'react-router';
import validateColor from 'validate-color';
import CustomColorPicker from '../../../components/custom-color-picker/CustomColorPicker';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Selector from '../../../components/form-components/Selector';
import { useToast } from '../../../components/context/toast/ToastContext';
import List from '../../../components/list/List';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import SwitchW from '../../../components/wrapper/SwitchW';
import { useThemeChange } from '../../../components/context/ThemeChangeContext';
import ThemeType from '../../../enums/ThemeType';
import ThemeService from '../../../services/ThemeService';
import FileUtils from '../../../utils/FileUtils';
import BoxW from '../../../components/wrapper/BoxW';
import DropzoneAreaW from '../../../components/wrapper/DropzoneAreaW';
import useFormUtils from '../../../components/hook/useFormUtils';
import FormGenerics from '../../../components/form-generic/FormGenerics';

const EditTheme = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { id } = useParams();
  const { getPaletteJSON, previewChanges, setPreviewChanges, setLightTheme, setDarkTheme, composeTheme, rollbackDefaultTheme } =
    useThemeChange();
  const { validateUnique } = useFormUtils();

  const [openDialog, setOpenDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [preview, setPreview] = useState(previewChanges);
  const [uploadJsonFile, setUploadJsonFile] = useState(null);
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required()
      .test('unique', '', (value) => validateUnique(ThemeService, 'name', value, 'name', originalUniqueValues?.name === value)),
    type: yup.number().required(),
    colorPalette: yup
      .array()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('colorPalette', '', () => validateColorPalette()),
  });

  const { control, formState, handleSubmit, setValue, getValues, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const themeType = watch('type', ThemeType.getValue('LIGHT'));
  const colorPaletteHook = watch('colorPalette', []);

  function validateColorPalette() {
    const palette = getValues('colorPalette');
    if (palette == null || palette.length === 0) {
      return false;
    }
    const result = palette.every((item) => typeof item.color === 'string' && item.color.length > 0);
    if (!result) {
      addToast({ body: t('toastes.colorPaletteValueError'), type: 'error' });
    }
    return result;
  }

  const prepareFind = useCallback(
    (responseData) => {
      const uniqueValues = {};
      _.forOwn(responseData, (value, key) => {
        switch (key) {
          case 'name':
            uniqueValues[key] = value;
            setValue(key, value);
            return;
          case 'type':
            setValue(key, ThemeType.getValue(value));
            return;
          case 'colorPalette':
            // eslint-disable-next-line no-case-declarations
            const colorInOrder = _.pick(value, [
              'primary',
              'secondary',
              'error',
              'warning',
              'info',
              'success',
              'toolbarBackgroundColor',
              'titleCardBackgroundColor',
              'appBarBackgroundColor',
              'sidebarBackgroundColor',
            ]);
            setValue(
              key,
              Object.entries(colorInOrder).map((pair) => ({ cod: pair[0], description: pair[0], color: pair[1] }))
            );
            return;
          default:
            setValue(key, value);
        }
      });
      setOriginalUniqueValues(uniqueValues);
    },
    [setValue]
  );

  useEffect(() => {
    if (formState.isDirty) {
      return;
    }
    if (id == null) {
      const jsonPalette = Object.entries(getPaletteJSON(themeType === ThemeType.getValue('LIGHT')));
      setValue(
        'colorPalette',
        jsonPalette.map((pair) => ({ cod: pair[0], description: pair[0], color: pair[1] }))
      );
    }
  }, [addToast, formState.isDirty, getPaletteJSON, id, setValue, t, themeType]);

  useEffect(() => {
    if (preview && preview !== previewChanges) {
      setPreviewChanges(true);
      return;
    }
    if (!preview && preview !== previewChanges) {
      setPreviewChanges(false);
      rollbackDefaultTheme();
    }
  }, [preview, previewChanges, rollbackDefaultTheme, setPreviewChanges]);

  useEffect(() => {
    if (preview && colorPaletteHook) {
      if (colorPaletteHook.length === 0) {
        return;
      }
      const colorState = Object.fromEntries(colorPaletteHook.map((item) => [item.cod, item.color]));
      if (!Object.values(colorState).every((value) => validateColor(value))) {
        return;
      }
      if (themeType === ThemeType.getValue('LIGHT')) {
        setLightTheme(composeTheme('light', colorState));
        return;
      }
      setDarkTheme(composeTheme('dark', colorState));
    }
  }, [colorPaletteHook, composeTheme, preview, setDarkTheme, setLightTheme, themeType]);

  const updateColor = useCallback(
    (color, idx) => {
      const data = _.clone(getValues('colorPalette'));
      data[idx].color = color;
      setValue('colorPalette', data);
    },
    [getValues, setValue]
  );

  const prepareSave = (genericForm) => {
    const form = genericForm;
    form.colorPalette = Object.fromEntries(getValues('colorPalette').map((item) => [item.cod, item.color]));
    if (!Object.values(form.colorPalette).every((value) => validateColor(value))) {
      addToast({ body: t('toastes.colorPaletteValueFormat'), type: 'error' });
      return false;
    }
    return true;
  };

  const handleDownload = () => {
    const colorData = Object.fromEntries(colorPaletteHook.map((item) => [item.cod, item.color]));
    FileUtils.saveJsonFileFromObject(colorData, 'colorPalette.json');
  };

  const handleUpload = () => {
    if (uploadJsonFile == null) {
      addToast({ body: t('toastes.uploadFile.noFileError'), type: 'error' });
      return;
    }
    setOpenDialog(false);
    FileUtils.getContentLocalFileJson(uploadJsonFile, (content) => {
      if (content === null) {
        addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
        return;
      }
      if (content === undefined) {
        addToast({ body: t('toastes.uploadFile.syntaxError'), type: 'error' });
        return;
      }
      const jsonPalette = getPaletteJSON();
      const paletteKeys = Object.keys(jsonPalette);
      const contentEntries = Object.entries(content);
      const contentKeys = Object.keys(content);
      if (contentKeys.every((key) => paletteKeys.includes(key)) && paletteKeys.every((key) => contentKeys.includes(key))) {
        if (contentEntries.every((entry) => typeof entry[1] === 'string')) {
          const realContent = contentEntries.map((entry) => ({ cod: entry[0], description: entry[0], color: entry[1] }));
          setValue('colorPalette', realContent);
          addToast({ body: t('toastes.uploadFile.upload'), type: 'success' });
          return;
        }
        addToast({ body: t('toastes.uploadFile.keysError'), type: 'error' });
        return;
      }
      addToast({ body: t('toastes.uploadFile.keysError'), type: 'error' });
    });
  };

  const columns = useMemo(
    () => [
      {
        name: 'cod',
        label: t('pages.editTheme.columns.cod'),
        options: {
          filter: true,
        },
      },
      {
        name: 'description',
        label: t('pages.editTheme.columns.description'),
        options: {
          filter: true,
          customBodyRender: (cod) => t(`enums.colorPalette.${cod}`),
        },
      },
      {
        name: 'editor',
        label: t('pages.editTheme.columns.editor'),
        options: {
          filter: false,
          sort: false,
          searchable: false,
          customBodyRenderLite: (dataIndex) => (
            <CustomColorPicker value={watch('colorPalette')[dataIndex].color} onChange={(color) => updateColor(color, dataIndex)} />
          ),
        },
      },
    ],
    [t, updateColor, watch]
  );

  const options = {
    elevation: 1,
    selectableRows: 'none',
    rowsPerPage,
    onChangeRowsPerPage: (numberOfRows) => setRowsPerPage(numberOfRows),
    customToolbar: () => (
      <>
        <Tooltip title={t('pages.editTheme.tooltip.download')}>
          <IconButton onClick={handleDownload}>
            <CloudDownload />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('pages.editTheme.tooltip.upload')}>
          <IconButton onClick={() => setOpenDialog(true)}>
            <CloudUpload />
          </IconButton>
        </Tooltip>
      </>
    ),
  };

  return (
    <FormGenerics
      title={[
        t('pages.themeList.toolbar.title'),
        { title: t('layouts.sidebar.themes'), url: '/cli/themes/tab/1' },
        { title: t(`pages.editTheme.toolbar.${id ? 'editTheme' : 'newTheme'}`) },
      ]}
      goBack="/cli/themes/tab/1"
      id={id}
      defaultService={ThemeService}
      handleSubmit={handleSubmit}
      prepareSave={prepareSave}
      prepareFind={prepareFind}
    >
      <CustomDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={t('pages.editTheme.tooltip.upload')}
        content={
          <DropzoneAreaW
            acceptedFiles={['.json']}
            dropzoneText={t('pages.editTheme.chooseJSON.dropzoneText')}
            onChange={(files) => setUploadJsonFile(files[0])}
          />
        }
        buttonText={t('pages.editTheme.tooltip.upload')}
        buttonOnClick={handleUpload}
      />
      <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        {id && (
          <BoxW width="10%" p={1} minWidth="100px">
            <Controller
              name="id"
              render={({ field }) => <TextFieldW label={t('pages.editTheme.id')} {...field} disabled />}
              defaultValue={id}
              control={control}
            />
          </BoxW>
        )}
        <BoxW width={id ? '25%' : '35%'} p={1}>
          <Controller
            name="name"
            render={({ field }) => <TextFieldW label={t('pages.editTheme.name')} {...field} error={errors?.name} required />}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>
        <BoxW width="20%" p={1} minWidth="200px">
          <Controller
            name="type"
            render={({ field }) => (
              <Selector label={t('pages.editTheme.type')} {...field} error={errors?.type} required>
                {ThemeType.enums.map((item) => (
                  <MenuItem key={item.key} value={item.value}>
                    {t(`enums.themeTypes.${item.key}`)}
                  </MenuItem>
                ))}
              </Selector>
            )}
            defaultValue={ThemeType.getValue('LIGHT')}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>
        <BoxW width="30%" p={1}>
          <FormControlLabel
            control={<SwitchW checked={preview} onChange={(e) => setPreview(e.target.checked)} name="preview" size="big" primary />}
            label={t('pages.editTheme.preview')}
            labelPlacement="end"
          />
        </BoxW>
        <BoxW width="100%" p={1}>
          <List columns={columns} options={options} data={watch('colorPalette', [])} textLabelsCod="editTheme" />
        </BoxW>
      </BoxW>
    </FormGenerics>
  );
};

export default EditTheme;
