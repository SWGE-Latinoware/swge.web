import React, { useCallback, useState } from 'react';
import { Box, Card, IconButton, Tooltip, Typography } from '@mui/material';
import { Add, Cancel, Delete, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import NoticeService from '../../services/NoticeService';
import { useToast } from '../context/toast/ToastContext';
import useRTE from '../hook/useRTE';
import useLocation from '../hook/useLocation';
import MUIRichTextEditorW from '../wrapper/MUIRichTextEditorW';
import DeleteActionCustomDialog from '../delete-action-custom-dialog/DeleteActionCustomDialog';

const NoticeItem = (props) => {
  const { notice, caravan, allowEdit, setUpdateData } = props;

  const { addToast } = useToast();
  const { t } = useTranslation();
  const { renderFromState } = useRTE();
  const { formatLocaleString } = useLocation();

  const [updateNotice, setUpdateNotice] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const modifyUpdateNotice = () => {
    setUpdateNotice(!updateNotice);
  };

  const modifyDelete = () => {
    setOpenDeleteDialog(!openDeleteDialog);
  };

  const handleUpdateNotice = (data) => {
    const newNotice = _.clone(notice);
    newNotice.description = JSON.parse(data);
    newNotice.caravan = caravan;

    NoticeService.update(newNotice).then((response) => {
      if (response.status === 200) {
        setUpdateData(true);
        modifyUpdateNotice();
        return;
      }
      addToast({ body: t('toastes.saveError'), type: 'error' });
    });
  };

  const handleDeleteNotice = () => {
    NoticeService.deleteNotice(notice.id, caravan.id).then((response) => {
      if (response.status === 200) {
        setUpdateData(true);
      } else {
        addToast({ body: t('toastes.deleteError'), type: 'error' });
      }
      modifyDelete();
    });
  };

  return (
    <>
      <DeleteActionCustomDialog open={openDeleteDialog} onClose={() => modifyDelete()} buttonErrorOnClick={() => handleDeleteNotice()} />
      <Box width="100%" p={1}>
        <Card elevation={4}>
          <Box display="flex" width="100%" alignItems="center" justifyContent="space-between">
            <Box p={1}>
              <Typography>{caravan.coordinator.name}</Typography>
            </Box>
            <Box p={1}>
              <Typography>{formatLocaleString(notice.dateTime)}</Typography>
            </Box>
            {allowEdit && (
              <Box p={1}>
                <Tooltip title={updateNotice ? t('pages.noticePanel.tooltip.cancel') : t('pages.noticePanel.tooltip.edit')}>
                  <IconButton onClick={modifyUpdateNotice}>{updateNotice ? <Cancel /> : <Edit />}</IconButton>
                </Tooltip>
                <Tooltip title={t('pages.noticePanel.tooltip.delete')}>
                  <IconButton onClick={modifyDelete}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          <Box width="100%" p={1}>
            {updateNotice ? (
              <MUIRichTextEditorW
                media={false}
                label={t('pages.noticePanel.editor')}
                onSave={(data) => handleUpdateNotice(data)}
                defaultValue={notice.description}
              />
            ) : (
              renderFromState(notice.description)
            )}
          </Box>
        </Card>
      </Box>
    </>
  );
};

const NoticePanel = (props) => {
  const { notices, allowEdit, caravan, setUpdateData } = props;

  const { addToast } = useToast();
  const { t } = useTranslation();

  const [addNotice, setAddNotice] = useState(false);

  const renderNotices = useCallback(
    () => _.orderBy(notices, 'dateTime', 'desc').map((notice) => <NoticeItem key={notice.id} notice={notice} {...props} />),
    [notices, props]
  );

  const modifyAddNotice = () => {
    setAddNotice(!addNotice);
  };

  const handleAddNotice = (data) => {
    const notice = {
      dateTime: new Date(),
      description: JSON.parse(data),
      caravan,
    };
    NoticeService.create(notice).then((response) => {
      if (response.status === 200) {
        setUpdateData(true);
        modifyAddNotice();
        return;
      }
      addToast({ body: t('toastes.saveError'), type: 'error' });
    });
  };

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" width="100%" minWidth="100%" p={1} alignItems="center">
      {allowEdit && (
        <Box width="100%" minWidth="100%" justifyContent="flex-end" display="flex">
          <Box paddingRight={1}>
            <Tooltip title={addNotice ? t('pages.noticePanel.tooltip.cancel') : t('pages.noticePanel.tooltip.add')}>
              <IconButton onClick={modifyAddNotice}>{addNotice ? <Cancel /> : <Add />}</IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
      {addNotice && <MUIRichTextEditorW media={false} label={t('pages.noticePanel.editor')} onSave={(data) => handleAddNotice(data)} />}
      {renderNotices()}
    </Box>
  );
};

export default NoticePanel;
