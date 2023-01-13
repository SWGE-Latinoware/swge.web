import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';
import _ from 'lodash';
import Toolbar from '../../components/toolbar/Toolbar';
import TabsPanel from '../../components/tabs-panel/TabsPanel';
import RegistrationService from '../../services/RegistrationService';
import {
  FLUX_CARAVANS,
  FLUX_INSTITUTIONS,
  FLUX_REGISTRATIONS,
  FLUX_TUTORED_REGISTRATIONS,
  FLUX_USERS,
} from '../../components/context/FluxContext';
import ServerSideList from '../../components/server-side-list/ServerSideList';
import TutoredRegistrationService from '../../services/TutoredRegistrationService';
import CaravanService from '../../services/CaravanService';
import TagFileCreation from '../../components/tags/users/TagFileCreation';

const Tags = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const userColumns = useMemo(
    () => [
      {
        name: 'user.name',
        label: t('pages.tags.columns.userName'),
        options: {
          filter: true,
        },
      },
      {
        name: 'user.tagName',
        label: t('pages.tags.columns.tagName'),
        options: {
          filter: false,
        },
      },
    ],
    [t]
  );

  const tutoredColumns = useMemo(
    () => [
      {
        name: 'tutoredUser.name',
        label: t('pages.tags.columns.userName'),
        options: {
          filter: true,
        },
      },
      {
        name: 'tutoredUser.tagName',
        label: t('pages.tags.columns.tagName'),
        options: {
          filter: false,
        },
      },
    ],
    [t]
  );

  const caravanColumns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.tags.columns.userName'),
        options: {
          filter: true,
        },
      },
      {
        name: 'caravanEnrollmentCount',
        label: t('pages.tags.columns.caravanEnrollmentCount'),
        options: {
          filter: false,
          searchable: false,
          sort: false,
          customBodyRenderLite: (dataIndex) => data[dataIndex]?.vacancies - data[dataIndex].remainingVacancies,
        },
      },
    ],
    [data, t]
  );

  const options = {
    customToolbarSelect: (selectedRows) => (
      <Box paddingRight={1}>
        <Tooltip title={t('pages.tags.tooltip.generateTags')}>
          <IconButton
            onClick={() => {
              setOpenModal(true);
              setSelectedUsers(selectedRows.data);
            }}
          >
            <InsertDriveFile />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.secretary'), t('layouts.sidebar.tags')]} hasArrowBack />
      <TabsPanel
        primary
        tabs={[
          { label: t('pages.tags.tabs.registeredUsers'), enabled: true },
          { label: t('pages.tags.tabs.registeredTutoredUsers'), enabled: true },
          { label: t('pages.tags.tabs.caravans'), enabled: true },
        ]}
        panels={[
          <>
            <ServerSideList
              {...{
                columns: userColumns,
                data,
                setData,
                options,
              }}
              enableDefaultUseEffect
              textLabelsCod="tags"
              defaultService={RegistrationService}
              onRowsDeleteErrorToast="toastes.deletesError"
              onRowsDeleteToast="toastes.deletes"
              editionBasedMandatoryField="edition.id"
              defaultSortOrder={{ name: 'user.name', direction: 'asc' }}
              fluxListeners={useMemo(() => [FLUX_REGISTRATIONS], [])}
            />
            {openModal && (
              <TagFileCreation
                openModal={openModal}
                setOpenModal={setOpenModal}
                userData={data.map((elem) => elem.user)}
                selectedUsers={selectedUsers}
              />
            )}
          </>,
          <>
            <ServerSideList
              {...{
                columns: tutoredColumns,
                data,
                setData,
                options,
              }}
              enableDefaultUseEffect
              textLabelsCod="tags"
              defaultService={TutoredRegistrationService}
              onRowsDeleteErrorToast="toastes.deletesError"
              onRowsDeleteToast="toastes.deletes"
              editionBasedMandatoryField="edition.id"
              defaultSortOrder={{ name: 'tutoredUser.name', direction: 'asc' }}
              fluxListeners={useMemo(() => [FLUX_TUTORED_REGISTRATIONS], [])}
            />
            {openModal && (
              <TagFileCreation
                openModal={openModal}
                setOpenModal={setOpenModal}
                userData={data.map((elem) => elem.tutoredUser)}
                selectedUsers={selectedUsers}
              />
            )}
          </>,
          <>
            <ServerSideList
              {...{
                columns: caravanColumns,
                options,
                data,
                setData,
              }}
              enableDefaultUseEffect
              textLabelsCod="caravanList"
              defaultService={CaravanService}
              onRowsDeleteErrorToast="toastes.deleteErrors"
              onRowsDeleteToast="toastes.deletes"
              editionBasedMandatoryField="edition.id"
              defaultSortOrder={{ name: 'name', direction: 'asc' }}
              fluxListeners={useMemo(() => [FLUX_USERS, FLUX_INSTITUTIONS, FLUX_CARAVANS], [])}
            />
            {openModal && (
              <TagFileCreation
                openModal={openModal}
                setOpenModal={setOpenModal}
                userData={data.map((elem) =>
                  _.concat(
                    elem.caravanEnrollments?.map((enrol) => enrol.user),
                    elem.caravanTutoredEnrollments?.map((enrol) => enrol.tutoredUser)
                  )
                )}
                caravanData={data}
                selectedUsers={selectedUsers}
              />
            )}
          </>,
        ]}
      />
    </>
  );
};

export default Tags;
