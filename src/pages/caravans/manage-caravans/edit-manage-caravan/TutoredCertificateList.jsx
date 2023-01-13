import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Download, PictureAsPdf } from '@mui/icons-material';
import { isAfter } from 'date-fns';
import _ from 'lodash';
import EditIcon from '@mui/icons-material/Edit';
import FoldingAccordion from '../../../../components/folding-accordion/FoldingAccordion';
import List from '../../../../components/list/List';
import useLocation from '../../../../components/hook/useLocation';
import TutoredRegistrationService from '../../../../services/TutoredRegistrationService';
import { useEditionChange } from '../../../../components/context/EditionChangeContext';
import CertificateService from '../../../../services/CertificateService';
import FileUtils from '../../../../utils/FileUtils';
import { useToast } from '../../../../components/context/toast/ToastContext';
import BoxW from '../../../../components/wrapper/BoxW';
import CustomDialog from '../../../../components/custom-dialog/CustomDialog';
import { useFlux } from '../../../../components/context/FluxContext';

const TutoredCertificateList = (props) => {
  const { formData } = props;

  const { t } = useTranslation();
  const { addToast } = useToast();
  const { formatLocaleString } = useLocation();
  const { currentEdition } = useEditionChange();
  const { certificatesUpdateDate, activitiesUpdateDate, tracksUpdateDate, tutoredRegistrationsUpdateDate } = useFlux();

  const [tutoCert, setTutoCert] = useState([]);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const data = useMemo(() => {
    let trackList = [];

    tutoCert.forEach((activity) => {
      const availableDate = activity.track.attendeeCertificate?.availabilityDateTime;

      const dataItem = {
        name: '-',
        userName: activity.userName,
        trackName: activity.track.name,
        availabilityDateTime: availableDate,
        certificateType: activity.certificateType,
        certId: activity.track.attendeeCertificate?.id,
        activityId: activity.id,
        trackId: activity.track.id,
        track: activity.track,
        userId: activity.userId,
        disabled: !isAfter(new Date(Date.now()), new Date(availableDate)),
      };

      trackList.push(dataItem);
    });

    trackList = _.uniqBy(trackList, (value) => `${value.trackId},${value.userName}`);

    return _.union(tutoCert, trackList);
  }, [tutoCert]);

  useEffect(() => {
    if (formData && currentEdition) {
      const { caravanTutoredEnrollments } = formData;
      const promises = [];
      const user = [];

      caravanTutoredEnrollments.forEach((reg) => {
        const { tutoredUser } = reg;
        user.push(tutoredUser);
        promises.push(TutoredRegistrationService.findOneByEditionAndTutoredUser(currentEdition.id, tutoredUser.id));
      });

      Promise.all(promises)
        .then((responses) => {
          const dataList = [];
          responses.forEach((registration, index) => {
            if (registration.status === 200) {
              const { individualRegistrations } = registration.data;

              individualRegistrations.forEach((obj) => {
                const { activity } = obj;
                const availableDate = activity.attendeeCertificate.availabilityDateTime;

                const dataItem = {
                  name: activity.name,
                  trackName: activity.track.name,
                  availabilityDateTime: availableDate,
                  userName: user[index].name,
                  certId: activity.attendeeCertificate.id,
                  activityId: activity.id,
                  trackId: activity.track.id,
                  track: activity.track,
                  userId: user[index].id,
                  disabled: !isAfter(new Date(Date.now()), new Date(availableDate)),
                };

                dataList.push(dataItem);
              });
            }
          });
          return dataList;
        })
        .then((res) => setTutoCert(res));
    }
  }, [currentEdition, formData, certificatesUpdateDate, activitiesUpdateDate, tracksUpdateDate, tutoredRegistrationsUpdateDate]);

  const handlePreview = useCallback(
    (dataIndex) => {
      const obj = data[dataIndex];

      CertificateService.generatePDF(obj.certId, true, obj.userId, obj.trackId, obj.activityId).then((response) => {
        if (response.status === 200) {
          const file = new Blob([response.data], { type: 'application/pdf' });
          setOpenPreviewDialog(true);
          setPreviewPDF(URL.createObjectURL(file));
          return;
        }
        addToast({ body: t('toastes.errorGetData'), type: 'error' });
      });
    },
    [addToast, data, t]
  );

  const handleDownload = useCallback(
    (dataIndex) => {
      const obj = data[dataIndex];

      CertificateService.generatePDF(obj.certId, true, obj.userId, obj.trackId, obj.activityId).then((response) => {
        if (response.status === 200) {
          const file = new Blob([response.data], { type: 'application/pdf' });
          FileUtils.fileSaver(file, `${obj.name}.pdf`);

          return;
        }
        addToast({ body: t('toastes.errorGetData'), type: 'error' });
      });
    },
    [addToast, data, t]
  );

  const handleDownloadAll = (files) => {
    const fileName = [];
    const promises = [];
    const filesPdf = [];

    files.forEach((file) => {
      if (!file.disabled) {
        fileName.push(`${file.name === '-' ? file.trackName : file.name}-${file.userName}.pdf`);
        promises.push(CertificateService.generatePDF(file.certId, true, file.userId, file.trackId, file.activityId));
      }
    });

    Promise.all(promises)
      .then((responses) => {
        responses.forEach((response, index) => {
          if (response.status === 200) {
            const content = new Blob([response.data], { type: 'application/pdf' });
            const file = new File([content], fileName[index]);
            filesPdf.push(file);
          }
        });
        return filesPdf;
      })
      .then((res) => {
        FileUtils.createZipFile(res, (zipblob) => {
          FileUtils.fileSaver(zipblob, 'Certificados.zip');
        });
      });
  };

  const columns = useMemo(
    () => [
      {
        name: 'userName',
        label: t('pages.tutoredUsersCertificateList.columns.userName'),
        options: {
          filter: false,
        },
      },
      {
        name: 'name',
        label: t('pages.tutoredUsersCertificateList.columns.activityName'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' || value === '-' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' || value === '-' ? t(`enums.empty.EMPTY`) : value),
          },
        },
      },
      {
        name: 'trackName',
        label: t('pages.tutoredUsersCertificateList.columns.trackName'),
        options: {
          filter: true,
        },
      },

      {
        name: 'availabilityDateTime',
        label: t('pages.tutoredUsersCertificateList.columns.availability'),
        options: {
          filter: false,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
      {
        name: 'preview',
        label: t('pages.tutoredUsersCertificateList.columns.preview'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) => (
            <IconButton onClick={() => handlePreview(dataIndex)} disabled={data[dataIndex].disabled}>
              <PictureAsPdf />
            </IconButton>
          ),
        },
      },
      {
        name: 'file',
        label: t('pages.tutoredUsersCertificateList.columns.download'),
        options: {
          filter: false,
          sort: false,
          searchable: false,
          customBodyRenderLite: (dataIndex) => (
            <Tooltip title={t('pages.tutoredUsersCertificateList.tooltip.download')}>
              <IconButton onClick={() => handleDownload(dataIndex)} disabled={data[dataIndex].disabled}>
                <Download />
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
    [t, formatLocaleString, data, handlePreview, handleDownload]
  );

  const options = {
    customToolbarSelect: (selectedRows) => (
      <Box paddingRight={1}>
        <Tooltip title={t('pages.editManageCaravan.tooltip.add')}>
          <IconButton onClick={() => handleDownloadAll(selectedRows.data.map((p) => data[p.dataIndex]))}>
            <Download />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    isRowSelectable: (selectedRow) => !data[selectedRow].disabled,
  };

  return (
    <>
      <CustomDialog
        open={openPreviewDialog}
        onClose={() => {
          setOpenPreviewDialog(!openPreviewDialog);
        }}
        title={t('pages.editCertificate.certificatePreview')}
        dialogProps={{ maxWidth: 'md' }}
        content={
          previewPDF && (
            <BoxW sx={{ width: '100%', height: '70vh' }}>
              <iframe src={previewPDF} width="100%" height="100%" title="Pré-Visualização" />
            </BoxW>
          )
        }
        buttonErrorText={t('dialog.cancelDeleteDialog')}
      />
      <FoldingAccordion
        title={t('pages.editManageCaravan.tutoredCertificates')}
        panels={[
          <List
            {...{
              columns,
              data,
              isLoading,
              setLoading,
            }}
            options={options}
            textLabelsCod="tutoredUsersCertificateList"
            defaultSortOrder={{ name: 'availabilityDateTime', direction: 'asc' }}
          />,
        ]}
      />
    </>
  );
};

export default TutoredCertificateList;
