import React, { useMemo, useState } from 'react';

import MUIDataTable from 'mui-datatables';
import { useTranslation } from 'react-i18next';
import { alpha, Box, CircularProgress } from '@mui/material';
import { useHistory } from 'react-router';
import _ from 'lodash';
import { useToast } from '../context/toast/ToastContext';
import DeleteActionCustomDialog from '../delete-action-custom-dialog/DeleteActionCustomDialog';

const List = (props) => {
  const { isLoading, setLoading, data, setData, updateData, setUpdateData, rowsSelected, setRowsSelected, ...otherProps } = props;

  const [isLoadingAux, setLoadingAux] = useState(false);
  const [dataAux, setDataAux] = useState([]);
  const [updateDataAux, setUpdateDataAux] = useState(true);
  const [rowsSelectedAux, setRowsSelectedAux] = useState([]);

  return (
    <InnerList
      isLoading={isLoading == null ? isLoadingAux : isLoading}
      setLoading={setLoading == null ? setLoadingAux : setLoading}
      data={data == null ? dataAux : data}
      setData={setData == null ? setDataAux : setData}
      updateData={updateData == null ? updateDataAux : updateData}
      setUpdateData={setUpdateData == null ? setUpdateDataAux : setUpdateData}
      rowsSelected={rowsSelected == null ? rowsSelectedAux : rowsSelected}
      setRowsSelected={setRowsSelected == null ? setRowsSelectedAux : setRowsSelected}
      {...otherProps}
    />
  );
};

const InnerList = (props) => {
  const {
    options,
    textLabelsCod,
    isLoading,
    defaultOnRowClickURL,
    defaultService,
    data: dataAux,
    setUpdateData,
    onRowsDeleteToast,
    onRowsDeleteErrorToast,
    onRowsDeleteOk,
    defaultSortOrder,
    rowsSelected,
    setRowsSelected,
    ...otherProps
  } = props;

  const history = useHistory();
  const { addToast } = useToast();
  const { t } = useTranslation();

  if (options && defaultSortOrder) options.sortOrder = defaultSortOrder;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowsDeleted, setRowsDeleted] = useState([]);
  const data = useMemo(() => _.map(dataAux, (line) => _.mapValues(line, (obj) => (obj == null ? '' : obj))), [dataAux]);

  const textLabels = textLabelsCod
    ? {
        textLabels: {
          body: {
            noMatch: t(`pages.${textLabelsCod}.tableOptions.textLabels.body.noMatch`),
            toolTip: t(`pages.${textLabelsCod}.tableOptions.textLabels.body.toolTip`),
          },
          pagination: {
            next: t(`pages.${textLabelsCod}.tableOptions.textLabels.pagination.next`),
            previous: t(`pages.${textLabelsCod}.tableOptions.textLabels.pagination.previous`),
            rowsPerPage: t(`pages.${textLabelsCod}.tableOptions.textLabels.pagination.rowsPerPage`),
            displayRows: t(`pages.${textLabelsCod}.tableOptions.textLabels.pagination.displayRows`),
            jumpToPage: t(`pages.${textLabelsCod}.tableOptions.textLabels.pagination.jumpToPage`),
          },
          toolbar: {
            search: t(`pages.${textLabelsCod}.tableOptions.textLabels.toolbar.search`),
            downloadCsv: t(`pages.${textLabelsCod}.tableOptions.textLabels.toolbar.downloadCsv`),
            print: t(`pages.${textLabelsCod}.tableOptions.textLabels.toolbar.print`),
            viewColumns: t(`pages.${textLabelsCod}.tableOptions.textLabels.toolbar.viewColumns`),
            filterTable: t(`pages.${textLabelsCod}.tableOptions.textLabels.toolbar.filterTable`),
          },
          filter: {
            all: t(`pages.${textLabelsCod}.tableOptions.textLabels.filter.all`),
            title: t(`pages.${textLabelsCod}.tableOptions.textLabels.filter.title`),
            reset: t(`pages.${textLabelsCod}.tableOptions.textLabels.filter.reset`),
          },
          viewColumns: {
            title: t(`pages.${textLabelsCod}.tableOptions.textLabels.viewColumns.title`),
            titleAria: t(`pages.${textLabelsCod}.tableOptions.textLabels.viewColumns.titleAria`),
          },
          selectedRows: {
            text: t(`pages.${textLabelsCod}.tableOptions.textLabels.selectedRows.text`),
            delete: t(`pages.${textLabelsCod}.tableOptions.textLabels.selectedRows.delete`),
            deleteAria: t(`pages.${textLabelsCod}.tableOptions.textLabels.selectedRows.deleteAria`),
          },
        },
      }
    : {};

  const defaultOptions = {
    ...textLabels,
    serverSide: false,
    jumpToPage: true,
    page: 0,
    filter: data.length > 0 ? true : 'disabled',
    filterType: 'checkbox',
    rowsPerPage: 10,
    download: false,
    print: false,
    sortOrder: {},
    enableNestedDataAccess: '.',
    rowsPerPageOptions: (options && options.rowsPerPageOptions) || [5, 10, 20, 50, 100],
    setTableProps: () => ({
      sx: (theme) => ({
        '& th': {
          borderBottomColor: alpha(theme.palette.dividers.card, 0.3),
        },
        '& td': {
          borderBottomColor: alpha(theme.palette.dividers.card, 0.3),
        },
      }),
    }),
    onRowClick: defaultOnRowClickURL
      ? (rowData, rowMeta) => {
          history.push(`${defaultOnRowClickURL}/${data[rowMeta.dataIndex].id}`);
        }
      : undefined,
    onRowsDelete: onRowsDeleteToast
      ? (deletedRows) => {
          setRowsSelected(deletedRows.data.map((item) => item.dataIndex));
          setOpenDeleteDialog(true);
          setRowsDeleted(deletedRows);
          return false;
        }
      : undefined,
    rowsSelected,
  };

  const handleDelete = () => {
    setOpenDeleteDialog(false);
    setRowsSelected([]);
    const idxs = rowsDeleted.data.map((row) => row.dataIndex);
    const ids = idxs.map((idx) => data[idx].id);
    if (defaultService) {
      defaultService.deleteAll(ids).then((response) => {
        if (response.status === 200) {
          if (onRowsDeleteOk) {
            onRowsDeleteOk(rowsDeleted);
          }
          addToast({ body: t(onRowsDeleteToast), type: 'success' });
          setUpdateData(true);
          return;
        }
        addToast({ body: t(onRowsDeleteErrorToast), type: 'error' });
      });
    } else if (onRowsDeleteOk) {
      onRowsDeleteOk(rowsDeleted);
    }
  };

  const finalOptions = _.merge({}, defaultOptions, options || {});

  return (
    <>
      {onRowsDeleteToast && (
        <DeleteActionCustomDialog
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialog(!openDeleteDialog);
            setRowsSelected([]);
          }}
          buttonErrorOnClick={() => handleDelete()}
        />
      )}
      {isLoading && (
        <Box position="absolute" top="50%" left="50%">
          <CircularProgress size={70} />
        </Box>
      )}
      <MUIDataTable options={finalOptions} data={data} {...otherProps} />
    </>
  );
};

export default List;
