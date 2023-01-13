import React, { useCallback, useMemo, useState } from 'react';
import { Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { Add, Help, QrCode2 } from '@mui/icons-material';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { useToast } from '../../../components/context/toast/ToastContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import FormUtils from '../../../utils/FormUtils';
import DateTimePickerW from '../../../components/wrapper/DateTimePickerW';
import List from '../../../components/list/List';
import InsertContentDialog from './InsertContentDialog';
import CertificateService from '../../../services/CertificateService';
import FileService from '../../../services/FileService';
import BoxW from '../../../components/wrapper/BoxW';
import DropzoneAreaW from '../../../components/wrapper/DropzoneAreaW';
import useFormUtils from '../../../components/hook/useFormUtils';
import FormGenerics from '../../../components/form-generic/FormGenerics';
import PreviewCertificate from './PreviewCertificate';
import { SimpleContentDisplay } from '../../registrations/my-registration/ActivityCard';
import CheckboxW from '../../../components/wrapper/CheckboxW';
import PopoverW from '../../../components/wrapper/PopoverW';

const EditCertificate = (props) => {
  const { isInternalPage = false, id: internalID, goBack } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();
  const history = useHistory();
  const { id: idURL } = useParams();
  const { currentEdition } = useEditionChange();
  const { validateUniqueEdition } = useFormUtils();

  const id = isInternalPage ? internalID : idURL;

  const [data, setData] = useState([]);
  const [uploadBackground, setUploadBackground] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [editContentData, setEditContentData] = useState(null);
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required()
      .test('unique', '', (value) =>
        validateUniqueEdition(CertificateService, 'name', value, 'name', currentEdition?.id, originalUniqueValues?.name === value)
      ),
    availabilityDateTime: yup.date().required(),
  });

  const { control, handleSubmit, setValue, formState, getValues, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const image = watch('backgroundImage', undefined);

  const certificateName = watch('name', undefined);

  const qrCode = watch('allowQrCode', true);

  const initialFile = useMemo(() => image && [image], [image]);

  const handleBackgroundChange = useCallback(
    (operation) => {
      const form = new FormData();
      const parts = uploadBackground.name.split('.');
      form.append('name', uploadBackground.name.replace(`.${parts[parts.length - 1]}`, ''));
      if (parts.length > 1) {
        form.append('format', parts[parts.length - 1]);
      }
      form.append('file', uploadBackground);
      if (id) form.append('id', getValues('backgroundImage').id);
      const promise = id ? FileService.update(form) : FileService.create(form);
      promise.then((response) => {
        operation(response);
      });
    },
    [getValues, id, uploadBackground]
  );

  const handleSave = useCallback(
    (formCertificate) => {
      const form = FormUtils.removeEmptyFields(formCertificate);
      if (currentEdition == null) {
        addToast({ body: t('toastes.noCurrentEditionError'), type: 'error' });
        return;
      }
      form.edition = currentEdition;
      data.forEach((content) => {
        // eslint-disable-next-line no-param-reassign
        content.certificate = { id };
      });
      form.dynamicContents = data;
      if (!uploadBackground) {
        addToast({ body: t('toastes.noBackgroundImage'), type: 'error' });
        return;
      }
      const operation = (response) => {
        if (response.status === 200) {
          form.backgroundImage = response.data;
          if (id) {
            CertificateService.update(form).then((responseAux) => {
              if (responseAux.status === 200) {
                addToast({ body: t('toastes.update'), type: 'success' });
                if (goBack) {
                  if (typeof goBack === 'string') history.push(goBack);
                  else goBack();
                } else history.push('/cli/certificates');
              } else {
                addToast({ body: t('toastes.saveError'), type: 'error' });
              }
            });
            return;
          }
          CertificateService.create(form).then((responseAux) => {
            if (responseAux.status === 200) {
              addToast({ body: t('toastes.save'), type: 'success' });
              if (goBack) {
                if (typeof goBack === 'string') history.push(goBack);
                else goBack();
              } else history.push('/cli/certificates');
            } else {
              addToast({ body: t('toastes.saveError'), type: 'error' });
            }
          });
          return;
        }
        addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
      };
      if (uploadBackground) {
        handleBackgroundChange(operation);
        return;
      }
      operation({ status: 200, data: form.backgroundImage });
    },
    [addToast, currentEdition, data, goBack, handleBackgroundChange, history, id, t, uploadBackground]
  );

  const prepareFind = useCallback(
    (responseData) => {
      const uniqueValues = {};
      _.forOwn(responseData, (value, key) => {
        switch (key) {
          case 'name':
            uniqueValues[key] = value;
            setValue(key, value);
            return;
          case 'availabilityDateTime':
            setValue(key, new Date(value));
            return;
          case 'dynamicContents':
            setData(value);
            return;
          default:
            setValue(key, value);
        }
      });
      setOriginalUniqueValues(uniqueValues);
    },
    [setValue]
  );

  const handleInsert = (form, dataIndex) => {
    const newData = _.clone(data);
    if (dataIndex != null) {
      _.pullAt(newData, [dataIndex]);
    }
    newData.push(form);
    setData(newData);
  };

  const handleDeleteDynamicContent = (rowsDeleted) => {
    const rows = rowsDeleted.data.map((d) => d.dataIndex);
    _.pullAt(data, rows);
    const newData = _.clone(data);
    setData(newData);
  };

  const columns = useMemo(
    () => [
      {
        name: 'x',
        label: t('pages.editCertificate.columns.x'),
        options: {
          filter: false,
        },
      },
      {
        name: 'y',
        label: t('pages.editCertificate.columns.y'),
        options: {
          filter: false,
        },
      },
      {
        name: 'content',
        label: t('pages.editCertificate.columns.content'),
        options: {
          filter: true,
        },
      },
      {
        name: 'fontSize',
        label: t('pages.editCertificate.columns.fontSize'),
        options: {
          filter: false,
        },
      },
      {
        name: 'fontFamily',
        label: t('pages.editCertificate.columns.font'),
        options: {
          filter: false,
          customBodyRender: (value) => t(`enums.fonts.${value}`),
        },
      },
      {
        name: 'fontColor',
        label: t('pages.editCertificate.columns.color'),
        options: {
          filter: false,
        },
      },
    ],
    [t]
  );

  const handleOpenEvent = (e) => {
    setAnchorEl(e.target);
  };

  const HelpPopOver = () => (
    <PopoverW
      {...{
        anchorEl,
        setAnchorEl,
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <BoxW p={1} display="flex" width="100%" flexDirection="column" textWrap="wrap" maxWidth="500px">
        <Typography fontWeight="bold">{t('pages.editCertificate.help.title')}</Typography>
        <Typography>{t('pages.editCertificate.help.content')}</Typography>
        <Divider
          sx={(theme) => ({ '&::before, &::after': { borderColor: theme.palette.getContrastText(theme.palette.background.paper) } })}
        >
          {t('pages.editCertificate.help.track.title')}
        </Divider>
        <BoxW p={1}>
          <SimpleContentDisplay leftItem="{{track.name}}" rightItem={t('pages.editCertificate.help.track.name')} />
          <SimpleContentDisplay leftItem="{{track.initialDate}}" rightItem={t('pages.editCertificate.help.track.initialDate')} />
          <SimpleContentDisplay leftItem="{{track.finalDate}}" rightItem={t('pages.editCertificate.help.track.finalDate')} />
        </BoxW>
        <Divider
          sx={(theme) => ({ '&::before, &::after': { borderColor: theme.palette.getContrastText(theme.palette.background.paper) } })}
        >
          {t('pages.editCertificate.help.user.title')}
        </Divider>
        <BoxW p={1}>
          <SimpleContentDisplay leftItem="{{user.name}}" rightItem={t('pages.editCertificate.help.user.name')} />
        </BoxW>
        <Divider
          sx={(theme) => ({ '&::before, &::after': { borderColor: theme.palette.getContrastText(theme.palette.background.paper) } })}
        >
          {t('pages.editCertificate.help.edition.title')}
        </Divider>
        <BoxW p={1}>
          <SimpleContentDisplay leftItem="{{edition.name}}" rightItem={t('pages.editCertificate.help.edition.name')} />
          <SimpleContentDisplay leftItem="{{edition.year}}" rightItem={t('pages.editCertificate.help.edition.year')} />
          <SimpleContentDisplay leftItem="{{edition.institution}}" rightItem={t('pages.editCertificate.help.edition.institution')} />
        </BoxW>
        <Divider
          sx={(theme) => ({ '&::before, &::after': { borderColor: theme.palette.getContrastText(theme.palette.background.paper) } })}
        >
          {t('pages.editCertificate.help.activity.title')}
        </Divider>
        <BoxW p={1}>
          <SimpleContentDisplay leftItem="{{activity.name}}" rightItem={t('pages.editCertificate.help.activity.name')} />
          <SimpleContentDisplay leftItem="{{activity.workload}}" rightItem={t('pages.editCertificate.help.activity.workload')} />
        </BoxW>
      </BoxW>
    </PopoverW>
  );

  const options = {
    customToolbar: () => (
      <>
        <Tooltip title={t('pages.editCertificate.tooltip.help')}>
          <IconButton onClick={handleOpenEvent}>
            <Help />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('pages.editCertificate.tooltip.add')}>
          <IconButton
            onClick={() => {
              setEditContentData(null);
              setOpenDialog(true);
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('pages.editCertificate.tooltip.preview')}>
          <span>
            <PreviewCertificate certificateTitle={certificateName} backgroundImg={uploadBackground} content={data} containQrCode={qrCode} />
          </span>
        </Tooltip>
      </>
    ),
    onRowClick: (rowData, rowMeta) => {
      setEditContentData({ data: data[rowMeta.dataIndex], index: rowMeta.dataIndex });
      setOpenDialog(true);
    },
  };

  return (
    <FormGenerics
      title={[
        t('layouts.sidebar.records'),
        { title: t('layouts.sidebar.certificates'), url: '/cli/certificates' },
        t(`pages.editCertificate.toolbar.${id ? 'editCertificate' : 'newCertificate'}`),
      ]}
      goBack={goBack || '/cli/certificates'}
      id={id}
      defaultService={CertificateService}
      handleSubmit={handleSubmit}
      handleExternSave={handleSave}
      prepareFind={prepareFind}
      disableToolbar={isInternalPage}
    >
      <HelpPopOver />
      {openDialog && (
        <InsertContentDialog
          {...{
            openDialog,
            setOpenDialog,
            handleInsert,
          }}
          formData={editContentData?.data}
          dataIndex={editContentData?.index}
        />
      )}
      <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        {id && (
          <BoxW width="10%" p={1} minWidth="100px">
            <Controller
              name="id"
              render={({ field }) => <TextFieldW label={t('pages.editCertificate.id')} {...field} disabled />}
              defaultValue={id}
              control={control}
            />
          </BoxW>
        )}
        <BoxW width={id ? '50%' : '60%'} p={1}>
          <Controller
            name="name"
            render={({ field }) => <TextFieldW label={t('pages.editCertificate.name')} {...field} error={errors?.name} required />}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>
        <BoxW width="30%" p={1} minWidth="200px">
          <Controller
            name="availabilityDateTime"
            render={({ field }) => (
              <DateTimePickerW
                label={t('pages.editCertificate.availabilityDateTime')}
                {...field}
                error={errors?.availabilityDateTime}
                required
                disablePast
              />
            )}
            defaultValue={null}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>

        <BoxW width="10%" p={1} minWidth="100px">
          <Controller
            name="allowQrCode"
            render={({ field }) => (
              <SimpleContentDisplay
                leftItem={<QrCode2 sx={{ fontSize: 55 }} />}
                rightItem={
                  <Tooltip title={t('pages.editCertificate.tooltip.enableQrCode')}>
                    <div>
                      <CheckboxW tooltipText={t('pages.editCertificate.tooltip.enableQrCode')} checked={field.value} primary {...field} />
                    </div>
                  </Tooltip>
                }
                isIcon
              />
            )}
            defaultValue={false}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>

        <BoxW p={1} width="100%">
          <DropzoneAreaW
            initialFiles={initialFile}
            dropzoneText={t('pages.editCertificate.backgroundImage.dropzoneText')}
            onChange={(files) => setUploadBackground(files[0])}
          />
        </BoxW>
        <BoxW width="100%" p={1}>
          <List
            title={t('pages.editCertificate.tableOptions.title')}
            {...{
              columns,
              options,
              data,
              setData,
            }}
            textLabelsCod="editCertificate"
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            onRowsDeleteOk={handleDeleteDynamicContent}
          />
        </BoxW>
      </BoxW>
    </FormGenerics>
  );
};

export default EditCertificate;
