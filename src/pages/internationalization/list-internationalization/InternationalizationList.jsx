import React, { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add, CloudDownload, CloudUpload } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import LanguageIcon from '@mui/icons-material/Language';
import Toolbar from '../../../components/toolbar/Toolbar';
import List from '../../../components/list/List';
import FlagIcon from '../../../components/flag-icon/FlagIcon';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import SwitchW from '../../../components/wrapper/SwitchW';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import DropzoneAreaW from '../../../components/wrapper/DropzoneAreaW';

const InternationalizationList = () => {
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const columns = useMemo(() => [
    {
      name: 'cod',
      label: t('pages.internationalizationList.columns.cod'),
      options: {
        filter: true,
      },
    },
    {
      name: 'flag',
      label: t('pages.internationalizationList.columns.flag'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (country) => {
          if (country === '' || country === null || country === undefined) {
            return <LanguageIcon />;
          }
          return <FlagIcon country={country} />;
        },
      },
    },
    {
      name: 'download',
      label: t('pages.internationalizationList.columns.download'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: () => (
          <Tooltip title={t('pages.internationalizationList.columns.download')}>
            <IconButton>
              <CloudDownload />
            </IconButton>
          </Tooltip>
        ),
      },
    },
    {
      name: 'upload',
      label: t('pages.internationalizationList.columns.upload'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: () => (
          <Tooltip title={t('pages.internationalizationList.columns.upload')}>
            <IconButton onClick={() => setOpenDialog(true)}>
              <CloudUpload />
            </IconButton>
          </Tooltip>
        ),
      },
    },
    {
      name: 'enable',
      label: t('pages.internationalizationList.columns.enable'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (enable) => (
          <SwitchW
            defaultChecked={enable}
            name="preview"
            primary
          />
        ),
      },
    },
  ], [t]);

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.internationalizationList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/edit-internationalization')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  const getLangCode = (lang) => {
    const code = lang.split('-');
    if (code.length === 2) {
      return code[1].toLowerCase();
    }
    return null;
  };

  useEffect(() => {
    setData(Object.keys(i18n.store.data).map((lang) => [lang, getLangCode(lang), null, null, true]));
  }, [i18n.languages, i18n.store.data]);

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.customization'),
          t('layouts.sidebar.internationalization'),
        ]}
        hasArrowBack
      />
      <CustomDialog
        open={openDialog}
        onClose={() => setOpenDialog(!openDialog)}
        title={t('pages.internationalizationList.tooltip.upload')}
        content={(
          <DropzoneAreaW
            acceptedFiles={['.json']}
            dropzoneText={t('pages.internationalizationList.chooseJSON.dropzoneText')}
          />
          )}
        buttonText={t('pages.internationalizationList.tooltip.upload')}
      />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <List
            columns={columns}
            options={options}
            data={data}
            textLabelsCod="internationalizationList"
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default InternationalizationList;
