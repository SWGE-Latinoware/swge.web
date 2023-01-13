import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Download, PictureAsPdf } from '@mui/icons-material';
import _ from 'lodash';
import { isAfter } from 'date-fns';
import Toolbar from '../../../components/toolbar/Toolbar';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import useLocation from '../../../components/hook/useLocation';
import List from '../../../components/list/List';
import RegistrationService from '../../../services/RegistrationService';
import { useUserChange } from '../../../components/context/UserChangeContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import UserRoleType from '../../../enums/UserRoleType';
import EditionService from '../../../services/EditionService';
import CertificateService from '../../../services/CertificateService';
import BoxW from '../../../components/wrapper/BoxW';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import FileUtils from '../../../utils/FileUtils';
import { useToast } from '../../../components/context/toast/ToastContext';
import { useFlux } from '../../../components/context/FluxContext';

const MyCertificates = () => {
  const { t } = useTranslation();
  const { formatLocaleString } = useLocation();
  const { currentUser } = useUserChange();
  const { currentEdition } = useEditionChange();
  const { addToast } = useToast();
  const { certificatesUpdateDate, activitiesUpdateDate, tracksUpdateDate, registrationsUpdateDate } = useFlux();

  const [attendeeList, setAttendeeList] = useState([]);
  const [speakerList, setSpeakerList] = useState([]);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const data = useMemo(() => {
    let trackList = [];
    const all = _.union(attendeeList, speakerList);

    all.forEach((activity) => {
      const availableDate =
        activity.certificateType === UserRoleType.getValue('ATTENDEE')
          ? activity.track.attendeeCertificate?.availabilityDateTime
          : activity.track.speakerCertificate?.availabilityDateTime;

      if (!availableDate) return;

      const dataItem = {
        name: '-',
        trackName: activity.track.name,
        availabilityDateTime: availableDate,
        certificateType: activity.certificateType,
        certId:
          activity.certificateType === UserRoleType.getValue('ATTENDEE')
            ? activity.track.attendeeCertificate?.id
            : activity.track.speakerCertificate?.id,
        activityId: activity.id,
        trackId: activity.track.id,
        track: activity.track,
        userId: currentUser?.id,
        disabled: !isAfter(new Date(Date.now()), new Date(availableDate)),
      };

      trackList.push(dataItem);
    });

    trackList = _.uniqBy(trackList, (value) => `${value.trackId},${value.certificateType}`);

    return _.union(all, trackList);
  }, [attendeeList, currentUser?.id, speakerList]);

  useEffect(() => {
    if (currentEdition && currentUser) {
      RegistrationService.findOneByEditionAndUser(currentEdition.id, currentUser.id).then((res) => {
        if (res.status === 200) {
          const list = [];

          res.data.individualRegistrations.forEach((obj) => {
            const { activity } = obj;
            const availableDate = activity.attendeeCertificate.availabilityDateTime;

            const dataItem = {
              name: activity.name,
              trackName: activity.track.name,
              availabilityDateTime: availableDate,
              certificateType: UserRoleType.getValue('ATTENDEE'),
              certId: activity.attendeeCertificate.id,
              activityId: activity.id,
              trackId: activity.track.id,
              track: activity.track,
              userId: currentUser.id,
              disabled: !isAfter(new Date(Date.now()), new Date(availableDate)),
            };

            list.push(dataItem);
          });
          setAttendeeList(list);
        }
      });

      EditionService.findAllActivitiesBySpeaker(currentEdition.id, currentUser.id).then((res) => {
        if (res.status === 200) {
          const list = [];

          res.data.forEach((activity) => {
            const availableDate = activity.attendeeCertificate.availabilityDateTime;

            const dataItem = {
              name: activity.name,
              trackName: activity.track.name,
              availabilityDateTime: activity.speakerCertificate.availabilityDateTime,
              certificateType: UserRoleType.getValue('SPEAKER'),
              certId: activity.speakerCertificate.id,
              activityId: activity.id,
              trackId: activity.track.id,
              track: activity.track,
              userId: currentUser.id,
              disabled: !isAfter(new Date(Date.now()), new Date(availableDate)),
            };

            list.push(dataItem);
          });
          setSpeakerList(list);
        }
      });
    }
  }, [currentEdition, currentUser, certificatesUpdateDate, activitiesUpdateDate, tracksUpdateDate, registrationsUpdateDate]);

  const handlePreview = useCallback(
    (dataIndex) => {
      const obj = data[dataIndex];

      CertificateService.generatePDF(obj.certId, false, obj.userId, obj.trackId, obj.activityId).then((response) => {
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

      CertificateService.generatePDF(obj.certId, false, obj.userId, obj.trackId, obj.activityId).then((response) => {
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
        fileName.push(`${file.name === '-' ? file.trackName : file.name}-${UserRoleType.getKey(file.certificateType)}.pdf`);
        promises.push(CertificateService.generatePDF(file.certId, false, file.userId, file.trackId, file.activityId));
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
        name: 'name',
        label: t('pages.myCertificatesList.columns.activityName'),
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
        label: t('pages.myCertificatesList.columns.trackName'),
        options: {
          filter: true,
        },
      },
      {
        name: 'certificateType',
        label: t('pages.myCertificatesList.columns.certificateType'),
        options: {
          filter: false,
          customBodyRender: (value) => t(`enums.userRoleType.${UserRoleType.getKey(value)}`),
        },
      },
      {
        name: 'availabilityDateTime',
        label: t('pages.myCertificatesList.columns.availability'),
        options: {
          filter: false,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
      {
        name: 'preview',
        label: t('pages.myCertificatesList.columns.preview'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) => (
            <Tooltip title={t('pages.myCertificatesList.tooltip.preview')}>
              <IconButton onClick={() => handlePreview(dataIndex)} disabled={data[dataIndex].disabled}>
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
          ),
        },
      },
      {
        name: 'file',
        label: t('pages.myCertificatesList.columns.download'),
        options: {
          filter: false,
          sort: false,
          searchable: false,
          customBodyRenderLite: (dataIndex) => (
            <Tooltip title={t('pages.myCertificatesList.tooltip.download')}>
              <IconButton onClick={() => handleDownload(dataIndex)} disabled={data[dataIndex].disabled}>
                <Download />
              </IconButton>
            </Tooltip>
          ),
        },
      },
    ],
    [t, formatLocaleString, handlePreview, data, handleDownload]
  );

  const options = {
    customToolbarSelect: (selectedRows) => (
      <Box paddingRight={1}>
        <Tooltip title={t('pages.myCertificatesList.tooltip.downloads')}>
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
      <Toolbar title={t('layouts.sidebar.myCertificates')} hasArrowBack />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <List
            {...{
              columns,
              data,
            }}
            options={options}
            textLabelsCod="myCertificatesList"
            defaultSortOrder={{ name: 'availabilityDateTime', direction: 'asc' }}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default MyCertificates;
