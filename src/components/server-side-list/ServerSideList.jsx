import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import List from '../list/List';
import ButtonW from '../wrapper/ButtonW';
import { useToast } from '../context/toast/ToastContext';
import { useEditionChange } from '../context/EditionChangeContext';
import {
  FLUX_ACTIVITIES,
  FLUX_CARAVAN_ENROLLMENTS,
  FLUX_CARAVAN_TUTORED_ENROLLMENTS,
  FLUX_CARAVANS,
  FLUX_CERTIFICATES,
  FLUX_EDITIONS,
  FLUX_EXCLUSIONS,
  FLUX_FEEDBACKS,
  FLUX_INSTITUTIONS,
  FLUX_REGISTRATIONS,
  FLUX_THEMES,
  FLUX_TRACKS,
  FLUX_TUTORED_REGISTRATIONS,
  FLUX_TUTORED_USERS,
  FLUX_USERS,
  FLUX_VOUCHERS,
  useFlux,
} from '../context/FluxContext';
import useLocation from '../hook/useLocation';
import useInstitution from '../hook/useInstitution';

const ServerSideList = (props) => {
  const {
    page,
    rowsPerPage,
    setRowsPerPage,
    isLoading,
    setLoading,
    count,
    setCount,
    data,
    setData,
    setPage,
    updateData,
    setUpdateData,
    setSortOrder,
    setFilterList,
    setSearchText,
    getFilters,
    searchText,
    sortOrder,
    filterList,
    editionBasedMandatoryField,
    mandatoryFilterList,
    defaultSortOrder,
    ...otherProps
  } = props;

  const { currentEdition } = useEditionChange();

  const [dataAux, setDataAux] = useState([]);
  const [isLoadingAux, setLoadingAux] = useState(false);
  const [updateDataAux, setUpdateDataAux] = useState(true);
  const [pageAux, setPageAux] = useState(0);
  const [rowsPerPageAux, setRowsPerPageAux] = useState(10);
  const [countAux, setCountAux] = useState(0);
  const [sortOrderAux, setSortOrderAux] = useState(defaultSortOrder || {});
  const [filterListAux, setFilterListAux] = useState([]);
  const [searchTextAux, setSearchTextAux] = useState(null);

  const defaultMandatory = useMemo(() => {
    if (!editionBasedMandatoryField) return {};
    if (currentEdition) {
      return { [editionBasedMandatoryField]: [currentEdition.id] };
    }
    return { [editionBasedMandatoryField]: [-1] };
  }, [currentEdition, editionBasedMandatoryField]);

  useEffect(() => {
    if (setUpdateData) {
      setUpdateData(true);
      return;
    }
    setUpdateDataAux(true);
  }, [defaultMandatory, setUpdateData]);

  return (
    <InnerServerSideList
      data={data == null ? dataAux : data}
      page={page == null ? pageAux : page}
      rowsPerPage={rowsPerPage == null ? rowsPerPageAux : rowsPerPage}
      setRowsPerPage={setRowsPerPage == null ? setRowsPerPageAux : setRowsPerPage}
      isLoading={isLoading == null ? isLoadingAux : isLoading}
      setLoading={setLoading == null ? setLoadingAux : setLoading}
      count={count == null ? countAux : count}
      setCount={setCount == null ? setCountAux : setCount}
      setData={setData == null ? setDataAux : setData}
      setPage={setPage == null ? setPageAux : setPage}
      updateData={updateData == null ? updateDataAux : updateData}
      setUpdateData={setUpdateData == null ? setUpdateDataAux : setUpdateData}
      setSortOrder={setSortOrder == null ? setSortOrderAux : setSortOrder}
      setFilterList={setFilterList == null ? setFilterListAux : setFilterList}
      setSearchText={setSearchText == null ? setSearchTextAux : setSearchText}
      searchText={searchText == null ? searchTextAux : searchText}
      sortOrder={sortOrder == null ? sortOrderAux : sortOrder}
      filterList={filterList == null ? filterListAux : filterList}
      mandatoryFilterList={_.merge({}, defaultMandatory, mandatoryFilterList || {})}
      {...otherProps}
    />
  );
};

const InnerServerSideList = (props) => {
  const {
    options,
    page,
    rowsPerPage,
    setRowsPerPage,
    isLoading,
    setLoading,
    count,
    setCount,
    data,
    setData,
    setPage,
    updateData,
    setUpdateData,
    setSortOrder,
    setFilterList,
    setSearchText,
    enableDefaultUseEffect,
    getFilters,
    searchText,
    columns,
    sortOrder,
    defaultService,
    filterList,
    mandatoryFilterList,
    fluxListeners,
    ...otherProps
  } = props;

  const { t } = useTranslation();
  const { addToast } = useToast();
  const { isCountryName, isStateName, isCityName } = useLocation();
  const {
    usersUpdateDate,
    tutoredUsersUpdateDate,
    institutionsUpdateDate,
    caravansUpdateDate,
    editionsUpdateDate,
    tracksUpdateDate,
    activitiesUpdateDate,
    certificatesUpdateDate,
    caravanEnrollmentsUpdateDate,
    caravanTutoredEnrollmentsUpdateDate,
    registrationsUpdateDate,
    tutoredRegistrationsUpdateDate,
    themesUpdateDate,
    feedbacksUpdateDate,
    vouchersUpdateDate,
    exclusionsUpdateDate,
  } = useFlux();
  const { institutionList } = useInstitution();

  const [updateByFlux, setUpdateByFlux] = useState(false);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_USERS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, usersUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_TUTORED_USERS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, tutoredUsersUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_INSTITUTIONS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, institutionsUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_CARAVANS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, caravansUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_EDITIONS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, editionsUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_TRACKS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, tracksUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_ACTIVITIES)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, activitiesUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_CERTIFICATES)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, certificatesUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_CARAVAN_ENROLLMENTS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, caravanEnrollmentsUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_CARAVAN_TUTORED_ENROLLMENTS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, caravanTutoredEnrollmentsUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_REGISTRATIONS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, registrationsUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_TUTORED_REGISTRATIONS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, tutoredRegistrationsUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_THEMES)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, themesUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_FEEDBACKS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, feedbacksUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_VOUCHERS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, vouchersUpdateDate]);

  useEffect(() => {
    if (fluxListeners?.includes(FLUX_EXCLUSIONS)) {
      setUpdateByFlux(true);
    }
  }, [fluxListeners, exclusionsUpdateDate]);

  if (options) options.sortOrder = sortOrder;

  const defaultGetFilters = useCallback(
    () =>
      filterList.some((filter) => filter.length > 0)
        ? Object.fromEntries(
            filterList
              .map((filter, idx) => {
                if (filter.length > 0) {
                  if (columns[idx].enum != null) {
                    return [columns[idx].name, filter.map((value) => columns[idx].enum.getValue(value))];
                  }
                  return [columns[idx].name, filter];
                }
                return undefined;
              })
              .filter((entry) => entry != null)
          )
        : undefined,
    [columns, filterList]
  );

  const handleFilterSubmit = (applyFilters) => {
    const filterListTemp = applyFilters();
    setFilterList(filterListTemp);
    setUpdateData(true);
  };

  const checkSearchText = useCallback(() => {
    if (isCountryName(searchText)) return isCountryName(searchText);
    if (isStateName(searchText)) return isStateName(searchText);
    if (isCityName(searchText)) return isCityName(searchText);
    return searchText;
  }, [isCityName, isCountryName, isStateName, searchText]);

  const isInstitutionName = useCallback(() => {
    if (searchText) {
      return _.find(institutionList, (institution) => institution.name === searchText) === undefined;
    }
    return false;
  }, [institutionList, searchText]);

  const changeColumnName = useCallback(
    (name) => (name === 'institution.name' && isInstitutionName() ? 'institution' : name),
    [isInstitutionName]
  );

  useEffect(() => {
    if (enableDefaultUseEffect && (updateData || updateByFlux)) {
      setUpdateData(false);
      setUpdateByFlux(false);
      setLoading(true);
      const filters = {
        query: searchText == null ? undefined : checkSearchText(),
        filters: getFilters ? getFilters() : defaultGetFilters(),
        queryFields: columns
          .map((c) => (c.options && (c.options.searchable == null || c.options.searchable === true) ? changeColumnName(c.name) : undefined))
          .filter((name) => name != null),
      };
      if (mandatoryFilterList) {
        if (!filters.filters) {
          filters.filters = {};
        }
        _.merge(filters.filters, mandatoryFilterList);
      }
      const params = {
        page,
        size: rowsPerPage,
        sort: sortOrder.name ? `${sortOrder.name},${sortOrder.direction}` : undefined,
        filter: filters,
      };
      defaultService.filter(params).then((response) => {
        if (response.status === 200) {
          setData(response.data.content);
          setCount(response.data.totalElements);
        } else {
          addToast({ body: t('toastes.errorGetData'), type: 'error' });
        }
        setLoading(false);
      });
    }
  }, [
    addToast,
    changeColumnName,
    checkSearchText,
    columns,
    defaultGetFilters,
    defaultService,
    enableDefaultUseEffect,
    getFilters,
    isInstitutionName,
    mandatoryFilterList,
    page,
    rowsPerPage,
    searchText,
    setCount,
    setData,
    setLoading,
    setUpdateData,
    sortOrder,
    t,
    updateByFlux,
    updateData,
  ]);

  const defaultOptions = {
    serverSide: true,
    rowsPerPageOptions: [5, 10, 20, 50],
    confirmFilters: true,
    customFilterDialogFooter: (currentFilterList, applyNewFilters) => (
      <Box marginTop="40px">
        <ButtonW primary onClick={() => handleFilterSubmit(applyNewFilters)}>
          {t('table.applyFilters')}
        </ButtonW>
      </Box>
    ),
    onFilterChange: (column, filterListTemp, type) => {
      if (type === 'chip') {
        const newFilters = () => filterListTemp;
        handleFilterSubmit(newFilters);
      }
    },
    page,
    rowsPerPage,
    count,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      setUpdateData(true);
    },
    onChangeRowsPerPage: (numberOfRows) => {
      setRowsPerPage(numberOfRows);
      setUpdateData(true);
    },
    onColumnSortChange: (changedColumn, direction) => {
      setSortOrder({
        name: changedColumn,
        direction,
      });
      setUpdateData(true);
    },
    onSearchChange: (text) => {
      setSearchText(text);
    },
    onSearchClose: () => {
      setSearchText(null);
      setUpdateData(true);
    },
    searchProps: {
      onKeyUp: (e) => {
        if (e.key === 'Enter') {
          setUpdateData(true);
        }
      },
    },
  };

  const finalOptions = _.merge({}, defaultOptions, options || {});

  return (
    <List
      options={finalOptions}
      isLoading={isLoading}
      data={data}
      setUpdateData={setUpdateData}
      columns={columns}
      defaultService={defaultService}
      {...otherProps}
    />
  );
};

export default ServerSideList;
