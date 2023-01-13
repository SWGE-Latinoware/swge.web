import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { PictureAsPdf } from '@mui/icons-material';
import useLocation from '../../../components/hook/useLocation';
import { FLUX_TUTORED_REGISTRATIONS } from '../../../components/context/FluxContext';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import TutoredRegistrationService from '../../../services/TutoredRegistrationService';
import DialogRegistration from './DialogRegistration';
import BoxW from '../../../components/wrapper/BoxW';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import FileService from '../../../services/FileService';
import { useToast } from '../../../components/context/toast/ToastContext';
import TutoredUserService from '../../../services/TutoredUserService';
import { useUserChange } from '../../../components/context/UserChangeContext';

const TutoredRegistrationListPanel = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentUser } = useUserChange();
  const { formatCurrency, formatLocaleString } = useLocation();

  const [data, setData] = useState([]);
  const [dataTutoredRegistration, setDataTutoredRegistration] = useState(undefined);
  const [openTutoredRegistration, setOpenTutoredRegistration] = useState(false);

  const [previewPDF, setPreviewPDF] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [reviewTutoredUser, setReviewTutoredUser] = useState(null);

  const handlePreview = useCallback(
    (dataIndex) => {
      const obj = data[dataIndex].tutoredUser;
      setReviewTutoredUser(obj);

      FileService.findOne(obj.authorization.id).then((response) => {
        if (response.status === 200) {
          const file = new Blob([response.data], { type: 'application/pdf' });
          setOpenPreviewDialog(true);
          setPreviewPDF(URL.createObjectURL(file));
          setOpenTutoredRegistration(false);
          return;
        }
        addToast({ body: t('toastes.errorGetData'), type: 'error' });
      });
    },
    [addToast, data, t]
  );

  const columns = useMemo(
    () => [
      {
        name: 'tutoredUser.name',
        label: t('pages.registrationList.columns.user'),
        options: {
          filter: true,
        },
      },
      {
        name: 'registrationDateTime',
        label: t('pages.registrationList.columns.registrationDateTime'),
        options: {
          filter: false,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
      {
        name: 'finalPrice',
        label: t('pages.registrationList.columns.price'),
        options: {
          filter: false,
          customBodyRender: (price) => formatCurrency(price),
        },
      },
      {
        name: 'payed',
        label: t('pages.registrationList.columns.payed'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customFilterListOptions: {
            render: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customBodyRender: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
        },
      },
      {
        name: 'authorization',
        label: t('pages.registrationList.columns.authorization'),
        options: {
          filter: false,
          sort: false,
          searchable: false,
          customBodyRenderLite: (dataIndex) => (
            <Tooltip title={t('pages.editManageCaravan.tooltip.preview')}>
              <IconButton onClick={() => handlePreview(dataIndex)} disabled={data[dataIndex].tutoredUser?.authorization === null}>
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
          ),
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
    [data, formatCurrency, formatLocaleString, handlePreview, t]
  );

  const options = {
    onRowClick: (rowData, rowMeta, click) => {
      if (click.target.tagName !== 'svg') {
        setDataTutoredRegistration({ data: data[rowMeta.dataIndex], index: rowMeta.dataIndex });
        setOpenTutoredRegistration(true);
      }
    },
  };

  const handleReviewTerm = useCallback(() => {
    reviewTutoredUser.reviewer = currentUser;
    TutoredUserService.update(reviewTutoredUser).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.reviewed'), type: 'success' });
        setOpenPreviewDialog(false);
        setReviewTutoredUser(null);
        return;
      }
      addToast({ body: t('toastes.reviewedError'), type: 'error' });
    });
  }, [addToast, currentUser, reviewTutoredUser, t]);

  return (
    <>
      <CustomDialog
        open={openPreviewDialog}
        onClose={() => {
          setOpenPreviewDialog(!openPreviewDialog);
        }}
        buttonText={reviewTutoredUser?.reviewer === null && t('pages.editManageCaravan.review')}
        buttonOnClick={reviewTutoredUser?.reviewer === null && handleReviewTerm}
        title={`${t('pages.editManageCaravan.authorizationPreview')} [${
          reviewTutoredUser?.reviewer !== null ? t('pages.editManageCaravan.reviewed') : t('pages.editManageCaravan.notReviewed')
        }]`}
        dialogProps={{ maxWidth: 'md' }}
        content={
          previewPDF && (
            <BoxW sx={{ width: '100%', height: '70vh' }}>
              <iframe src={previewPDF} width="100%" height="100%" title="Pré-Visualização" />
              {reviewTutoredUser?.reviewer !== null && (
                <BoxW p={1}>
                  <Typography fontSize={12}>
                    {t('pages.editManageCaravan.whoReview')}: {reviewTutoredUser?.reviewer?.name}
                  </Typography>
                </BoxW>
              )}
            </BoxW>
          )
        }
      />
      {openTutoredRegistration && !openPreviewDialog && (
        <DialogRegistration
          openDialog={openTutoredRegistration}
          setOpenDialog={setOpenTutoredRegistration}
          formData={dataTutoredRegistration?.data}
        />
      )}
      <ServerSideList
        {...{
          columns,
          data,
          setData,
          options,
        }}
        enableDefaultUseEffect
        textLabelsCod="registrationList"
        defaultService={TutoredRegistrationService}
        onRowsDeleteErrorToast="toastes.deletesError"
        onRowsDeleteToast="toastes.deletes"
        editionBasedMandatoryField="edition.id"
        defaultSortOrder={{ name: 'registrationDateTime', direction: 'desc' }}
        fluxListeners={useMemo(() => [FLUX_TUTORED_REGISTRATIONS], [])}
      />
    </>
  );
};

export default TutoredRegistrationListPanel;
