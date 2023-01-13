import React, { useMemo, useState } from 'react';
import {
  Box, FormControlLabel, IconButton, MenuItem, Tooltip,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Add } from '@mui/icons-material';
import Form from '../../../components/form-components/Form';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Selector from '../../../components/form-components/Selector';
import { useToast } from '../../../components/context/toast/ToastContext';
import Toolbar from '../../../components/toolbar/Toolbar';
import ButtonW from '../../../components/wrapper/ButtonW';
import List from '../../../components/list/List';
import SwitchW from '../../../components/wrapper/SwitchW';
import logoLatinoware from '../../../assets/image/latinoware.svg';
import tagImage from '../../../assets/image/tag.svg';
import DynamicCardBox from '../../../components/dynamic-box/DynamicCardBox';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import BoxW from '../../../components/wrapper/BoxW';
import DropzoneAreaW from '../../../components/wrapper/DropzoneAreaW';

const EditTemplate = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [templateType, setTemplateType] = useState(-1);
  const [data, setData] = useState([]);
  const [certificatePreview, setCertificatePreview] = useState(false);
  const [dataTag, setDataTag] = useState([]);
  const [tagPreview, setTagPreview] = useState(false);
  const [emailPreview, setEmailPreview] = useState(false);

  const {
    control,
  } = useForm();

  const addPosition = (table) => {
    const newData = _.clone(table === 'certificate' ? data : dataTag);
    newData.push([0, 0, '', 12, false, false, false]);
    if (table === 'certificate') {
      setData(newData);
      return;
    }
    setDataTag(newData);
  };

  const columns = useMemo(() => [
    {
      name: 'xPosition',
      label: t('pages.editTemplate.columns.xPosition'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (x) => (
          <Controller
            name="xPosition"
            render={({ field }) => (
              <TextFieldW
                type="number"
                {...field}
              />
            )}
            defaultValue={x}
            control={control}
          />
        ),
      },
    },
    {
      name: 'yPosition',
      label: t('pages.editTemplate.columns.yPosition'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (y) => (
          <Controller
            name="yPosition"
            render={({ field }) => (
              <TextFieldW
                type="number"
                {...field}
              />
            )}
            defaultValue={y}
            control={control}
          />
        ),
      },
    },
    {
      name: 'content',
      label: t('pages.editTemplate.columns.content'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (content) => (
          <Controller
            name="content"
            render={({ field }) => (
              <TextFieldW
                multiline
                {...field}
              />
            )}
            defaultValue={content}
            control={control}
          />
        ),
      },
    },
    {
      name: 'fontSize',
      label: t('pages.editTemplate.columns.fontSize'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (size) => (
          <Controller
            name="fontSize"
            render={({ field }) => (
              <TextFieldW
                type="number"
                {...field}
              />
            )}
            defaultValue={size}
            control={control}
          />
        ),
      },
    },
    {
      name: 'bold',
      label: t('pages.editTemplate.columns.bold'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (bold) => (
          <SwitchW
            defaultChecked={bold}
            name="bold"
            primary
          />
        ),
      },
    },
    {
      name: 'italic',
      label: t('pages.editTemplate.columns.italic'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (italic) => (
          <SwitchW
            defaultChecked={italic}
            name="italic"
            primary
          />
        ),
      },
    },
    {
      name: 'underlined',
      label: t('pages.editTemplate.columns.underlined'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (underlined) => (
          <SwitchW
            defaultChecked={underlined}
            name="underlined"
            primary
          />
        ),
      },
    },
  ], [control, t]);

  const options = {
    elevation: 1,
    search: false,
    filter: false,
    jumpToPage: false,
    viewColumns: false,
    onRowsDelete: (rowsDeleted, newTableData) => {
      setData(newTableData);
      return true;
    },
    customToolbar: () => (
      <>
        <Tooltip title={t('pages.editTemplate.tooltip.add')}>
          <IconButton onClick={() => addPosition('certificate')}>
            <Add />
          </IconButton>
        </Tooltip>
      </>
    ),
  };

  const optionsTag = {
    elevation: 1,
    search: false,
    filter: false,
    jumpToPage: false,
    viewColumns: false,
    onRowsDelete: (rowsDeleted, newTableData) => {
      setData(newTableData);
      return true;
    },
    customToolbar: () => (
      <>
        <Tooltip title={t('pages.editTemplate.tooltip.add')}>
          <IconButton onClick={() => addPosition('tag')}>
            <Add />
          </IconButton>
        </Tooltip>
      </>
    ),
  };

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.templates'),
          t('pages.editTemplate.toolbar.title'),
        ]}
        hasArrowBack
      />
      {certificatePreview && (
      <DynamicCardBox>
        <Box component="img" alt="" src={logoLatinoware} width="100%" height="auto" />
        <div>Imagem preview do certificado aqui!</div>
      </DynamicCardBox>
      )}
      {tagPreview && (
      <DynamicCardBox>
        <Box component="img" alt="" src={tagImage} width="100%" height="auto" />
        <div>Imagem preview da tag aqui!</div>
      </DynamicCardBox>
      )}
      {emailPreview && (
      <DynamicCardBox>
        <br />
        <br />
        <div>Preview do email aqui!</div>
        <br />
        <br />
      </DynamicCardBox>
      )}
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard elevation={4}>
          <Form name="editUserForm" onSubmit={() => addToast({ body: t('toastes.save'), type: 'success' })}>
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW width="45%" p={1}>
                <Controller
                  name="name"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.editTemplate.name')}
                      {...field}
                    />
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="20%" p={1}>
                <Controller
                  name="type"
                  render={({ field }) => (
                    <Selector
                      label={t('pages.editTemplate.type')}
                      {...field}
                      onChange={(e) => setTemplateType(e.target.value)}
                    >
                      <MenuItem value={0}>Email</MenuItem>
                      <MenuItem value={1}>Certificado</MenuItem>
                      <MenuItem value={2}>Etiqueta</MenuItem>
                    </Selector>
                  )}
                  control={control}
                />
              </BoxW>
              {templateType === 0 && (
              <BoxW width="30%" p={1}>
                <FormControlLabel
                  control={(
                    <SwitchW
                      name="emailPreview"
                      size="big"
                      primary
                      onChange={() => setEmailPreview(!emailPreview)}
                    />
                        )}
                  label={t('pages.editTemplate.previewEmail')}
                  labelPlacement="end"
                />
              </BoxW>
              )}
              {templateType === 1 && (
              <BoxW width="30%" p={1}>
                <FormControlLabel
                  control={(
                    <SwitchW
                      name="certificatePreview"
                      size="big"
                      primary
                      onChange={() => setCertificatePreview(!certificatePreview)}
                    />
                        )}
                  label={t('pages.editTemplate.preview')}
                  labelPlacement="end"
                />
              </BoxW>
              )}
              {templateType === 2 && (
              <BoxW width="30%" p={1}>
                <FormControlLabel
                  control={(
                    <SwitchW
                      name="tagPreviewTag"
                      size="big"
                      primary
                      onChange={() => setTagPreview(!tagPreview)}
                    />
                        )}
                  label={t('pages.editTemplate.previewTag')}
                  labelPlacement="end"
                />
              </BoxW>
              )}
              <BoxW display="flex" flexWrap="wrap" flexDirection="row" width="100%" justifyContent="flex-start">
                {templateType === 0 && (
                  <MUIRichTextEditorW
                    label="template de email..."
                  />
                )}
                {templateType === 1 && (
                <>
                  <BoxW width="22.5%" p={1}>
                    <Controller
                      name="dimensionX"
                      render={({ field }) => (
                        <TextFieldW
                          type="number"
                          suffix="cm"
                          label={t('pages.editTemplate.dimensionX')}
                          {...field}
                        />
                      )}
                      control={control}
                    />
                  </BoxW>
                  <BoxW width="22.5%" p={1}>
                    <Controller
                      name="dimensionY"
                      render={({ field }) => (
                        <TextFieldW
                          type="number"
                          suffix="cm"
                          label={t('pages.editTemplate.dimensionY')}
                          {...field}
                        />
                      )}
                      control={control}
                    />
                  </BoxW>
                  <BoxW p={1} width="100%">
                    <DropzoneAreaW />
                  </BoxW>
                  <BoxW p={1} width="100%">
                    <List
                      title={t('pages.editTemplate.positions')}
                      columns={columns}
                      options={options}
                      data={data}
                      textLabelsCod="editTemplate"
                    />
                  </BoxW>
                </>
                )}
                {templateType === 2 && (
                <>
                  <BoxW width="22.5%" p={1}>
                    <Controller
                      name="dimensionXTag"
                      render={({ field }) => (
                        <TextFieldW
                          type="number"
                          suffix="cm"
                          label={t('pages.editTemplate.dimensionXTag')}
                          {...field}
                        />
                      )}
                      control={control}
                    />
                  </BoxW>
                  <BoxW width="22.5%" p={1}>
                    <Controller
                      name="dimensionYTag"
                      render={({ field }) => (
                        <TextFieldW
                          type="number"
                          suffix="cm"
                          label={t('pages.editTemplate.dimensionYTag')}
                          {...field}
                        />
                      )}
                      control={control}
                    />
                  </BoxW>
                  <BoxW p={1} width="100%">
                    <DropzoneAreaW />
                  </BoxW>
                  <BoxW p={1} width="100%">
                    <List
                      title={t('pages.editTemplate.positions')}
                      columns={columns}
                      options={optionsTag}
                      data={dataTag}
                      textLabelsCod="editTemplate"
                    />
                  </BoxW>
                </>
                )}
              </BoxW>
              <BoxW display="flex" flexDirection="row" flexWrap="wrap" p={1} width="100%" justifyContent="center">
                <BoxW p={1} width="25%">
                  <ButtonW fullWidth primary type="submit">
                    {t('pages.editTemplate.save')}
                  </ButtonW>
                </BoxW>
              </BoxW>
            </BoxW>
          </Form>
        </StyledCard>
      </BoxW>
    </>
  );
};

export default EditTemplate;
