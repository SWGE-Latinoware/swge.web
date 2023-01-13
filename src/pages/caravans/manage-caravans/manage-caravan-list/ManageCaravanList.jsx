import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton } from '@mui/material';
import { isWithinInterval, parseISO } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../../components/toolbar/Toolbar';
import CaravanService from '../../../../services/CaravanService';
import List from '../../../../components/list/List';
import EditionService from '../../../../services/EditionService';
import { useEditionChange } from '../../../../components/context/EditionChangeContext';
import { useUserChange } from '../../../../components/context/UserChangeContext';
import { StyledCard } from '../../../../components/context/ThemeChangeContext';
import CaravanType from '../../../../enums/CaravanType';
import ServerSideList from '../../../../components/server-side-list/ServerSideList';
import { FLUX_CARAVANS, FLUX_INSTITUTIONS, FLUX_USERS } from '../../../../components/context/FluxContext';
import { useToast } from '../../../../components/context/toast/ToastContext';
import NotRegistrationInterval from '../../../errors/not-registration-interval/NotRegistrationInterval';

const ManageCaravanList = () => {
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();
  const { currentUser } = useUserChange();
  const { addToast } = useToast();

  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState(null);
  const useMemoFlux = useMemo(() => [FLUX_CARAVANS, FLUX_INSTITUTIONS, FLUX_USERS], []);

  useEffect(() => {
    if (currentUser && !currentUser.admin && currentEdition) {
      EditionService.findAllCaravansByCoordinator(currentEdition.id, currentUser.id).then((response) => {
        setData(response.data);
      });
    }
  }, [currentEdition, currentUser]);

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.manageCaravanList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'institution.name',
        label: t('pages.manageCaravanList.columns.institution'),
        options: {
          filter: true,
        },
      },
      ...(currentUser?.admin
        ? [
            {
              name: 'coordinator.name',
              label: t('pages.manageCaravanList.columns.coordinator'),
              options: {
                filter: true,
              },
            },
          ]
        : []),
      {
        name: 'type',
        label: t('pages.manageCaravanList.columns.type'),
        enum: CaravanType,
        options: {
          filter: true,
          filterOptions: {
            renderValue: (type) => t(`enums.caravanTypes.${type}`),
          },
          customFilterListOptions: {
            render: (type) => t(`enums.caravanTypes.${type}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.caravanTypes.${data[dataIndex].type}`),
        },
      },
      {
        name: 'vacancies',
        label: t('pages.manageCaravanList.columns.vacancies'),
        options: {
          filter: false,
        },
      },
      {
        name: 'remainingVacancies',
        label: t('pages.manageCaravanList.columns.remainingVacancies'),
        options: {
          filter: false,
          sort: false,
          searchable: false,
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
    [currentUser?.admin, data, t]
  );

  const options = {
    selectableRows: 'none',
  };

  const Component = useMemo(() => {
    if (currentUser) {
      return currentUser.admin ? ServerSideList : List;
    }
    return ServerSideList;
  }, [currentUser]);

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

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.caravans'), t('layouts.sidebar.manageCaravans')]} hasArrowBack />
      {displayData || displayData === null ? (
        <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          <StyledCard p={0} elevation={4}>
            <Component
              {...{
                columns,
                options,
                data,
                setData,
              }}
              enableDefaultUseEffect
              textLabelsCod="manageCaravanList"
              defaultOnRowClickURL="/cli/manage-caravan"
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
export default ManageCaravanList;
