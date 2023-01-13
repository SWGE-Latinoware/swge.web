import React, { useMemo, useState } from 'react';
import {
  Box, FormControlLabel, IconButton, Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { CloudDownload, CloudUpload } from '@mui/icons-material';
import { useParams } from 'react-router';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Form from '../../../components/form-components/Form';
import { useToast } from '../../../components/context/toast/ToastContext';
import List from '../../../components/list/List';
import Toolbar from '../../../components/toolbar/Toolbar';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import SwitchW from '../../../components/wrapper/SwitchW';
import ButtonW from '../../../components/wrapper/ButtonW';
import TabsPanel, { getInitialTabIndex } from '../../../components/tabs-panel/TabsPanel';
import DropzoneAreaW from '../../../components/wrapper/DropzoneAreaW';

const EditInternationalization = () => {
  const { addToast } = useToast();
  const { index } = useParams();
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [enable, setEnable] = useState(true);
  const [activeTab, setActiveTab] = useState(getInitialTabIndex(index));

  const {
    control,
  } = useForm();

  const columns = useMemo(() => [
    {
      name: 'cod',
      label: t('pages.editInternationalization.columns.cod'),
      options: {
        filter: true,
      },
    },
    {
      name: 'description',
      label: t('pages.editInternationalization.columns.description'),
      options: {
        filter: true,
      },
    },
    {
      name: 'reference',
      label: t('pages.editInternationalization.columns.reference'),
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'editor',
      label: t('pages.editInternationalization.columns.editor'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: () => <TextFieldW />,
      },
    },
  ], [t]);

  const options = {
    selectableRows: 'none',
    customToolbar: () => (
      <>
        <Tooltip title={t('pages.editInternationalization.tableOptions.textLabels.toolbar.downloadCsv')}>
          <IconButton>
            <CloudDownload />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('pages.editInternationalization.tooltip.upload')}>
          <IconButton onClick={() => setOpenDialog(true)}>
            <CloudUpload />
          </IconButton>
        </Tooltip>
      </>
    ),
  };

  const data = [
    ['editInternationalization', 'Coluna 4 da tabela tal', 'Text'],
    ['sidebarCustomization', 'Link no menu para a página de Auditoria', 'Customization'],
  ];

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.customization'),
          t('layouts.sidebar.internationalization'),
          t('pages.editInternationalization.toolbar.title')]}
        hasArrowBack
      />
      <CustomDialog
        open={openDialog}
        onClose={() => setOpenDialog(!openDialog)}
        title={t('pages.editInternationalization.tooltip.upload')}
        content={(
          <DropzoneAreaW
            acceptedFiles={['.json']}
            dropzoneText={t('pages.editInternationalization.chooseJSON.dropzoneText')}
          />
                )}
        buttonText={t('pages.editInternationalization.tooltip.upload')}
      />
      <TabsPanel
        primary
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          { label: 'Página de Login', enabled: true },
          { label: 'Página de Internacionalização', enabled: true },
          { label: 'Página de Auditoria', enabled: true },
        ]}
        panels={[
          (
            <List
              columns={columns}
              options={options}
              data={data}
              textLabelsCod="editInternationalization"
            />
          ),
          (
            <List
              columns={columns}
              options={options}
              data={data}
              textLabelsCod="editInternationalization"
            />
          ),
          (
            <List
              columns={columns}
              options={options}
              data={data}
              textLabelsCod="editInternationalization"
            />
          ),
        ]}
      />
      <Box p={3} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <Form name="editInternationalizationForm" onSubmit={() => addToast({ body: t('toastes.save'), type: 'success' })}>
          <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" justifyContent="center">
            <Box width="15%" p={1}>
              <Controller
                name="cod"
                render={({ field }) => (
                  <TextFieldW
                    label={t('pages.editInternationalization.cod')}
                    {...field}
                  />
                )}
                control={control}
              />
            </Box>
            <Box>
              <Tooltip title={t('pages.editInternationalization.tableOptions.textLabels.toolbar.downloadCsv')}>
                <IconButton>
                  <CloudDownload fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Tooltip title={t('pages.editInternationalization.tooltip.upload')}>
                <IconButton onClick={() => setOpenDialog(true)}>
                  <CloudUpload fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box p={1}>
              <FormControlLabel
                control={(
                  <SwitchW
                    checked={enable}
                    onChange={(e) => setEnable(e.target.checked)}
                    name="enable"
                    size="big"
                    primary
                  />
                    )}
                label={t('pages.editInternationalization.enable')}
                labelPlacement="end"
              />
            </Box>
            <Box p={1} width="15%">
              <ButtonW fullWidth primary type="submit">{t('pages.editInternationalization.save')}</ButtonW>
            </Box>
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default EditInternationalization;
