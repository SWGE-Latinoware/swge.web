import React, { useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Download } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import { useToast } from '../../../components/context/toast/ToastContext';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import FileService from '../../../services/FileService';
import FileUtils from '../../../utils/FileUtils';
import FeedbackService from '../../../services/FeedbackService';
import FeedbackDialog from './FeedbackDialog';
import FeedbackStatus from '../../../enums/FeedbackStatus';
import { FLUX_FEEDBACKS, FLUX_USERS } from '../../../components/context/FluxContext';
import useLocation from '../../../components/hook/useLocation';

const FeedbackList = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [dataFeedback, setDataFeedback] = useState(undefined);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const { formatLocaleString } = useLocation();

  const handleDownload = useCallback(
    (file) => {
      FileService.findOne(file?.id).then((response) => {
        if (response.status === 200) {
          FileUtils.fileSaver(response.data, file.name + (file.format && `.${file.format}`));
          return;
        }
        addToast({ body: t('toastes.errorGetData'), type: 'error' });
      });
    },
    [addToast, t]
  );

  const handleFeedbackUpdate = (feedbackForm) => {
    FeedbackService.update(feedbackForm).then((response) => {
      if (response.status === 200) {
        setUpdateData(true);
        addToast({ body: t('toastes.update'), type: 'success' });
        return;
      }
      addToast({ body: t('toastes.updateError'), type: 'error' });
    });
  };

  const columns = useMemo(
    () => [
      {
        name: 'title',
        label: t('pages.feedbackList.columns.title'),
        options: {
          filter: true,
        },
      },
      {
        name: 'user.name',
        label: t('pages.feedbackList.columns.user'),
        options: {
          filter: true,
        },
      },
      {
        name: 'status',
        label: t('pages.feedbackList.columns.status'),
        enum: FeedbackStatus,
        options: {
          filter: true,
          filterOptions: {
            renderValue: (status) => t(`enums.feedbackStatus.${status}`),
          },
          customFilterListOptions: {
            render: (status) => t(`enums.feedbackStatus.${status}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.feedbackStatus.${data[dataIndex].status}`),
        },
      },
      {
        name: 'creationDateTime',
        label: t('pages.myFeedbacks.date'),
        options: {
          filter: false,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
      {
        name: 'file',
        label: t('pages.feedbackList.columns.download'),
        options: {
          filter: false,
          sort: false,
          searchable: false,
          customBodyRender: (file) => (
            <Tooltip title={t('pages.feedbackList.tooltip.download')}>
              <IconButton
                onClick={(e) => {
                  handleDownload(file);
                  e.stopPropagation();
                }}
                disabled={!file}
              >
                <Download />
              </IconButton>
            </Tooltip>
          ),
        },
      },
      {
        name: 'apiVersion',
        label: t('pages.feedbackList.columns.apiVersion'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customBodyRenderLite: (dataIndex) =>
            data[dataIndex].apiVersion == null || data[dataIndex].apiVersion === '' ? '-' : data[dataIndex].apiVersion,
        },
      },
      {
        name: 'webVersion',
        label: t('pages.feedbackList.columns.webVersion'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customBodyRenderLite: (dataIndex) =>
            data[dataIndex].webVersion == null || data[dataIndex].webVersion === '' ? '-' : data[dataIndex].webVersion,
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
    [data, handleDownload, t, formatLocaleString]
  );

  const options = {
    onRowClick: (rowData, rowMeta) => {
      setDataFeedback({ data: data[rowMeta.dataIndex], index: rowMeta.dataIndex });
      setOpenFeedbackDialog(true);
    },
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.feedback'), t('layouts.sidebar.feedbacks')]} hasArrowBack />
      {openFeedbackDialog && (
        <FeedbackDialog
          openDialog={openFeedbackDialog}
          setOpenDialog={setOpenFeedbackDialog}
          handleInsert={handleFeedbackUpdate}
          formData={dataFeedback?.data}
          handleDownload={handleDownload}
        />
      )}
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <ServerSideList
            {...{
              columns,
              options,
              data,
              setData,
              updateData,
              setUpdateData,
            }}
            enableDefaultUseEffect
            textLabelsCod="feedbackList"
            defaultService={FeedbackService}
            defaultSortOrder={{ name: 'title', direction: 'asc' }}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            fluxListeners={useMemo(() => [FLUX_FEEDBACKS, FLUX_USERS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default FeedbackList;
