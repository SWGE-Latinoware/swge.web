import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isWithinInterval, parseISO } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../../components/toolbar/Toolbar';
import ServerSideList from '../../../../components/server-side-list/ServerSideList';
import CaravanService from '../../../../services/CaravanService';
import { useToast } from '../../../../components/context/toast/ToastContext';
import { useUserChange } from '../../../../components/context/UserChangeContext';
import CustomDialog from '../../../../components/custom-dialog/CustomDialog';
import useLocation from '../../../../components/hook/useLocation';
import FoldingAccordion from '../../../../components/folding-accordion/FoldingAccordion';
import NoticePanel from '../../../../components/notice-panel/NoticePanel';
import CaravanEnrollmentService from '../../../../services/CaravanEnrollmentService';
import CaravanType from '../../../../enums/CaravanType';
import { StyledCard } from '../../../../components/context/ThemeChangeContext';
import { FLUX_CARAVAN_ENROLLMENTS, FLUX_CARAVANS, FLUX_INSTITUTIONS } from '../../../../components/context/FluxContext';
import { useEditionChange } from '../../../../components/context/EditionChangeContext';
import NotRegistrationInterval from '../../../errors/not-registration-interval/NotRegistrationInterval';

const CaravanRegistrationList = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentUser } = useUserChange();
  const { getCountryName, formatState, formatCurrency } = useLocation();
  const { currentEdition } = useEditionChange();

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
  const [openCancelRegistrationDialog, setOpenCancelRegistrationDialog] = useState(false);
  const [registrationAttemptIdx, setRegistrationAttemptIdx] = useState(null);
  const [noticesObject, setNoticesObject] = useState(null);
  const [displayData, setDisplayData] = useState(null);
  const useMemoFlux = useMemo(() => [FLUX_CARAVANS, FLUX_CARAVAN_ENROLLMENTS, FLUX_INSTITUTIONS], []);

  const verifyUserRegistration = useCallback(
    (registration, verification) =>
      registration.caravanEnrollments.some((enroll) => currentUser && enroll.user.id === currentUser.id && enroll[verification]),
    [currentUser]
  );

  const handleRegistration = () => {
    CaravanService.userEnrollment(data[registrationAttemptIdx].id, currentUser.id).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.caravanEnrollment'), type: 'success' });
        setUpdateData(true);
        return;
      }
      addToast({ body: t('toastes.caravanEnrollmentError'), type: 'error' });
    });
    setOpenRegistrationDialog(false);
  };

  const handleCancelRegistration = () => {
    const enrollment = data[registrationAttemptIdx].caravanEnrollments.find(
      (enroll) => currentUser && enroll.user.id === currentUser.id && enroll.confirmed
    );
    enrollment.confirmed = false;
    enrollment.caravan = { id: data[registrationAttemptIdx].id };
    CaravanEnrollmentService.update(enrollment).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.caravanCancelEnrollment'), type: 'success' });
        setUpdateData(true);
        return;
      }
      addToast({ body: t('toastes.caravanCancelEnrollmentError'), type: 'error' });
    });
    setOpenCancelRegistrationDialog(false);
  };

  useEffect(() => {
    if (!currentEdition) {
      setDisplayData(null);
      return;
    }
    const registrationType = currentEdition?.registrationType;
    if (!registrationType) {
      setDisplayData(false);
      addToast({ body: t('toastes.noRegistrationType'), type: 'error' });
      return;
    }
    if (
      !isWithinInterval(new Date(), { start: parseISO(registrationType.initialDateTime), end: parseISO(registrationType.finalDateTime) })
    ) {
      setDisplayData(false);
      addToast({ body: t('toastes.noRegistrationTypeInterval'), type: 'error' });
      return;
    }
    setDisplayData(true);
  }, [addToast, currentEdition, t]);

  useEffect(() => {
    const caravan = data.find((caravanAux) =>
      caravanAux.caravanEnrollments.some(
        (enroll) => currentUser && enroll.user.id === currentUser.id && enroll.confirmed && enroll.accepted
      )
    );
    if (caravan == null) {
      setNoticesObject(null);
      return;
    }
    setNoticesObject({
      caravan,
      notices: caravan.notices,
    });
  }, [currentUser, data]);

  const mandatoryFields = {
    type: [CaravanType.getValue('GENERAL')],
  };

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.caravanRegistrationList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'country',
        label: t('pages.caravanRegistrationList.columns.country'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (country) => getCountryName(country),
          },
          customFilterListOptions: {
            render: (country) => getCountryName(country),
          },
          customBodyRenderLite: (dataIndex) => getCountryName(data[dataIndex].country),
        },
      },
      {
        name: 'state',
        label: t('pages.caravanRegistrationList.columns.state'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (formatState(value) == null || formatState(value) === '' ? t(`enums.empty.EMPTY`) : formatState(value)),
          },
          customFilterListOptions: {
            render: (value) => (formatState(value) == null || formatState(value) === '' ? t(`enums.empty.EMPTY`) : formatState(value)),
          },
          customBodyRenderLite: (dataIndex) =>
            formatState(data[dataIndex].state) == null || formatState(data[dataIndex].state) === ''
              ? '-'
              : formatState(data[dataIndex].state),
        },
      },
      {
        name: 'city',
        label: t('pages.caravanRegistrationList.columns.city'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customBodyRenderLite: (dataIndex) => (data[dataIndex].city == null || data[dataIndex].city === '' ? '-' : data[dataIndex].city),
        },
      },
      {
        name: 'institution.name',
        label: t('pages.caravanRegistrationList.columns.institution'),
        options: {
          filter: true,
        },
      },
      {
        name: 'price',
        label: t('pages.caravanRegistrationList.columns.price'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) => formatCurrency(data[dataIndex].price),
        },
      },
      {
        name: 'vacancies',
        label: t('pages.caravanRegistrationList.columns.vacancies'),
        options: {
          filter: false,
        },
      },
      {
        name: 'remainingVacancies',
        label: t('pages.caravanRegistrationList.columns.remainingVacancies'),
        options: {
          searchable: false,
          filter: false,
          sort: false,
        },
      },
      {
        name: 'confirmed',
        label: t('pages.caravanRegistrationList.columns.confirmed'),
        options: {
          searchable: false,
          filter: false,
          sort: false,
          customBodyRenderLite: (dataIndex) =>
            t(`enums.confirmed.${verifyUserRegistration(data[dataIndex], 'confirmed') ? 'CONFIRMED' : 'NOT_CONFIRMED'}`),
        },
      },
      {
        name: 'accepted',
        label: t('pages.caravanRegistrationList.columns.accepted'),
        options: {
          searchable: false,
          filter: false,
          sort: false,
          customBodyRenderLite: (dataIndex) =>
            t(`enums.accepted.${verifyUserRegistration(data[dataIndex], 'accepted') ? 'ACCEPTED' : 'NOT_ACCEPTED'}`),
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
    [data, formatCurrency, formatState, getCountryName, t, verifyUserRegistration]
  );

  const options = {
    selectableRows: 'none',
    onRowClick: (rowData, rowMeta) => {
      if (noticesObject == null) {
        setRegistrationAttemptIdx(rowMeta.dataIndex);
        if (verifyUserRegistration(data[rowMeta.dataIndex], 'confirmed')) {
          setOpenCancelRegistrationDialog(true);
          return;
        }
        setOpenRegistrationDialog(true);
        return;
      }
      addToast({ body: t('toastes.caravanEnrollmentAlreadyError'), type: 'warning' });
    },
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.caravans'), t('layouts.sidebar.myCaravans')]} hasArrowBack />
      <CustomDialog
        open={openRegistrationDialog}
        onClose={() => setOpenRegistrationDialog(false)}
        buttonOnClick={handleRegistration}
        title={t('pages.caravanRegistrationList.registrationDialogTitle')}
        content={
          <Box p={1} width="100%" height="100%" display="flex" flexWrap="wrap">
            <Box p={1} width="100%">
              <Typography sx={{ fontWeight: 'bold' }}>{registrationAttemptIdx != null && data[registrationAttemptIdx]?.name}</Typography>
            </Box>
            <Box p={1} width="100%">
              <Typography>{t('pages.caravanRegistrationList.registrationDialogContent')}</Typography>
            </Box>
          </Box>
        }
        buttonText={t('pages.caravanRegistrationList.confirmRegistrationDialog')}
      />
      <CustomDialog
        open={openCancelRegistrationDialog}
        onClose={() => setOpenCancelRegistrationDialog(false)}
        buttonErrorOnClick={handleCancelRegistration}
        title={t('pages.caravanRegistrationList.registrationCancelDialogTitle')}
        content={
          <Box p={1} width="100%" height="100%" display="flex" flexWrap="wrap">
            <Box p={1} width="100%">
              <Typography sx={{ fontWeight: 'bold' }}>{registrationAttemptIdx != null && data[registrationAttemptIdx]?.name}</Typography>
            </Box>
            <Box p={1} width="100%">
              <Typography>{t('pages.caravanRegistrationList.registrationCancelDialogContent')}</Typography>
            </Box>
          </Box>
        }
        buttonText={t('pages.caravanRegistrationList.confirmRegistrationCancelDialog')}
        buttonErrorText={t('pages.caravanRegistrationList.confirmRegistrationCancelDialogConfirm')}
      />
      {noticesObject && (
        <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          <StyledCard p={0} elevation={4}>
            <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <Box width="100%">
                <FoldingAccordion
                  title={t('pages.editManageCaravan.notices')}
                  panels={[
                    <Box width="100%" minWidth="100%">
                      <NoticePanel caravan={noticesObject.caravan} notices={noticesObject.notices} setUpdateData={setUpdateData} />
                    </Box>,
                  ]}
                />
              </Box>
            </Box>
          </StyledCard>
        </Box>
      )}
      {displayData || displayData === null ? (
        <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          <StyledCard p={0} elevation={4}>
            <ServerSideList
              {...{
                columns,
                options,
                data,
                updateData,
                setUpdateData,
                setData,
              }}
              mandatoryFilterList={mandatoryFields}
              enableDefaultUseEffect
              textLabelsCod="caravanRegistrationList"
              defaultService={CaravanService}
              editionBasedMandatoryField="edition.id"
              defaultSortOrder={{ name: 'name', direction: 'asc' }}
              fluxListeners={useMemoFlux}
            />
          </StyledCard>
        </Box>
      ) : (
        <NotRegistrationInterval />
      )}
    </>
  );
};

export default CaravanRegistrationList;
