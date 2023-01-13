import React, { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Add } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FormUtils from '../../../utils/FormUtils';
import InstitutionService from '../../../services/InstitutionService';
import useFormUtils from '../../../components/hook/useFormUtils';
import ConditionalMaskField from '../../../components/form-components/ConditionalMaskField';
import CountryAutoComplete from '../../../components/form-components/CountryAutoComplete';
import ConditionCityAutoComplete from '../../../components/form-components/ConditionCityAutoComplete';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import ConditionStateAutoComplete from '../../../components/form-components/ConditionStateAutoComplete';
import BoxW from '../../../components/wrapper/BoxW';
import List from '../../../components/list/List';
import InsertSpaceDialog from './InsertSpaceDialog';
import FormGenerics from '../../../components/form-generic/FormGenerics';

const EditInstitution = (props) => {
  const { isInternalPage = false, id: internalID, goBack } = props;
  const { t } = useTranslation();
  const { id: idURL } = useParams();
  const { validateMask, validateUnique } = useFormUtils();

  const id = isInternalPage ? internalID : idURL;

  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editContentData, setEditContentData] = useState(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required()
      .test('unique', '', (value) => validateUnique(InstitutionService, 'name', value, 'name', originalUniqueValues?.name === value)),
    website: yup.string().ensure().url(),
    phone: yup
      .string()
      .ensure()
      // eslint-disable-next-line no-use-before-define
      .test('match', '', (value) => validationMask(value)),
    cellPhone: yup
      .string()
      .ensure()
      // eslint-disable-next-line no-use-before-define
      .test('match', '', (value) => validationMask(value)),
  });

  const { control, handleSubmit, setValue, formState, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;
  const country = watch('country', 'BR');

  function validationMask(value) {
    return validateMask(value, country);
  }

  const prepareSave = (genericForm) => {
    const form = genericForm;
    form.spaces = data;
    return true;
  };

  const prepareFind = useCallback(
    (responseData) => {
      const uniqueValues = {};
      _.forOwn(responseData, (value, key) => {
        switch (key) {
          case 'name':
            uniqueValues[key] = value;
            setValue(key, value);
            return;
          case 'spaces':
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
        name: 'name',
        label: t('pages.editInstitution.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'number',
        label: t('pages.editInstitution.columns.number'),
        options: {
          filter: false,
        },
      },
      {
        name: 'actions',
        label: ' ',
        options: {
          filter: false,
          sort: false,
          searchable: false,
          viewColumns: false,
          customBodyRenderLite: () => (
            <IconButton tabIndex={-1}>
              <EditIcon />
            </IconButton>
          ),
        },
      },
    ],
    [t]
  );

  const options = {
    customToolbar: () => (
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
        { title: t('layouts.sidebar.institutions'), url: '/cli/institutions' },
        t(`pages.editInstitution.toolbar.${id ? 'editInstitution' : 'newInstitution'}`),
      ]}
      goBack={goBack || '/cli/institutions'}
      id={id}
      defaultService={InstitutionService}
      handleSubmit={handleSubmit}
      prepareSave={prepareSave}
      prepareFind={prepareFind}
      disableToolbar={isInternalPage}
    >
      {openDialog && (
        <InsertSpaceDialog
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
              render={({ field }) => <TextFieldW label={t('pages.editInstitution.id')} {...field} disabled />}
              defaultValue={id}
              control={control}
            />
          </BoxW>
        )}
        <BoxW width={id ? '65%' : '75%'} p={1}>
          <Controller
            name="name"
            render={({ field }) => <TextFieldW label={t('pages.editInstitution.name')} {...field} error={errors?.name} required />}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>
        <BoxW width="25%" p={1}>
          <Controller
            name="shortName"
            render={({ field }) => <TextFieldW label={t('pages.editInstitution.shortName')} {...field} />}
            control={control}
          />
        </BoxW>
        <BoxW width="50%" p={1}>
          <Controller
            name="country"
            render={({ field }) => <CountryAutoComplete label={t('pages.editInstitution.country')} {...field} />}
            defaultValue="BR"
            control={control}
          />
        </BoxW>
        <BoxW width="50%" p={1}>
          <Controller
            name="state"
            render={({ field }) => (
              <ConditionStateAutoComplete condition={country === 'BR'} label={t('pages.editInstitution.state')} {...field} />
            )}
            defaultValue=""
            control={control}
          />
        </BoxW>
        <BoxW width="50%" p={1}>
          <Controller
            name="city"
            render={({ field }) => (
              <ConditionCityAutoComplete
                condition={country === 'BR'}
                label={t('pages.editInstitution.city')}
                {...field}
                watch={watch}
                setValue={setValue}
              />
            )}
            defaultValue=""
            control={control}
          />
        </BoxW>
        <BoxW width="50%" p={1}>
          <Controller
            name="website"
            render={({ field }) => <TextFieldW label={t('pages.editInstitution.website')} {...field} error={errors?.website} />}
            control={control}
          />
        </BoxW>
        <BoxW width="25%" alignSelf="flex-start" p={1}>
          <Controller
            name="cellPhone"
            render={({ field }) => (
              <ConditionalMaskField
                condition={country === 'BR'}
                maskFieldProps={{
                  mask: FormUtils.cellPhoneMask,
                  error: errors?.cellPhone,
                }}
                label={t('pages.editInstitution.mobilePhone')}
                {...field}
              />
            )}
            control={control}
          />
        </BoxW>
        <BoxW width="25%" alignSelf="flex-start" p={1}>
          <Controller
            name="phone"
            render={({ field }) => (
              <ConditionalMaskField
                condition={country === 'BR'}
                maskFieldProps={{
                  mask: FormUtils.phoneMask,
                  error: errors?.phone,
                }}
                label={t('pages.editInstitution.phone')}
                {...field}
              />
            )}
            control={control}
          />
        </BoxW>
        <BoxW width="100%" p={1} paddingTop={2}>
          <List
            title={t('pages.editInstitution.tableOptions.title')}
            {...{
              columns,
              options,
              data,
              setData,
            }}
            textLabelsCod="editInstitution"
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            onRowsDeleteOk={handleDeleteDynamicContent}
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
          />
        </BoxW>
      </BoxW>
    </FormGenerics>
  );
};

export default EditInstitution;
