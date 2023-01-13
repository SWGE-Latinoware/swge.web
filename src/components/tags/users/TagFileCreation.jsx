import { Box, MenuItem, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { PageSizes } from 'pdf-lib';
import { useTranslation } from 'react-i18next';
import BoxW from '../../wrapper/BoxW';
import TextFieldW from '../../wrapper/TextFieldW';
import Selector from '../../form-components/Selector';
import AvailablePageSizes from '../../../enums/AvailablePageSizes';
import ButtonW from '../../wrapper/ButtonW';
import PreviewTags from '../../../pages/secretary/PreviewTags';
import StyledCheckbox from '../../wrapper/StyledCheckbox';
import CustomDialog from '../../custom-dialog/CustomDialog';
import FoldingAccordion from '../../folding-accordion/FoldingAccordion';

const TagFileCreation = (props) => {
  const { openModal, setOpenModal, userData, selectedUsers, caravanData } = props;

  const { t } = useTranslation();

  const [selectedTag, setSelectedTag] = useState([]);
  const [colSize, setColSize] = useState(0);
  const [rowSize, setRowSize] = useState(0);
  const [tagWidthSize, setTagWidthSize] = useState(0);
  const [tagHeightSize, setTagHeightSize] = useState(0);
  const [marginTopBottom, setMarginTopBottom] = useState(0);
  const [marginLeftRight, setMarginLeftRight] = useState(0);
  const [marginBetweenTagTopBottom, setMarginBetweenTagTopBottom] = useState(0);
  const [marginBetweenTagLeftRight, setMarginBetweenTagLeftRight] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState('');
  const [pageSize, setPageSize] = useState(AvailablePageSizes.enums[0].key);
  const [openTagsPreview, setOpenTagsPreview] = useState(false);
  const [startIndex, setStartIndex] = useState('');

  const selectedPageSize = useMemo(() => PageSizes[pageSize?.split(' ')[0]], [pageSize]);

  return (
    <CustomDialog
      open={openModal}
      onClose={() => {
        setOpenModal(!openModal);
      }}
      title={t('pages.tags.tagFilePreview')}
      dialogProps={{ maxWidth: 'lg' }}
      content={
        <BoxW p={2} display="flex" flexDirection="row">
          <BoxW>
            <BoxW minWidth="150px" p={1}>
              <Typography>
                {`${t('pages.tags.selectedUsers')} 
                ${
                  caravanData && selectedUsers.length
                    ? selectedUsers
                        ?.map((selected) => caravanData[selected.dataIndex].vacancies - caravanData[selected.dataIndex].remainingVacancies)
                        .reduce((total, index) => total + index)
                    : selectedUsers?.length
                }
                `}
              </Typography>
            </BoxW>
            <BoxW display="flex" flexDirection="row">
              <BoxW minWidth="150px" width="10%" p={1}>
                <TextFieldW
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  label={t('pages.tags.rowSize')}
                  value={rowSize}
                  onChange={(e) => {
                    setRowSize(e.target.value);
                  }}
                />
              </BoxW>
              <BoxW minWidth="150px" width="10%" p={1}>
                <TextFieldW
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  label={t('pages.tags.colSize')}
                  value={colSize}
                  onChange={(e) => setColSize(e.target.value)}
                />
              </BoxW>
            </BoxW>
            <BoxW minWidth="150px" p={1} display="flex" flexDirection="row">
              <Typography>{t('pages.tags.tagSize')}</Typography>
              <Typography sx={(theme) => ({ color: theme.palette.error.main })}>*</Typography>
            </BoxW>
            <BoxW display="flex" flexDirection="row">
              <BoxW minWidth="150px" width="10%" p={1}>
                <TextFieldW
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  label={t('pages.tags.tagWidthSize')}
                  value={tagWidthSize}
                  onChange={(e) => {
                    setTagWidthSize(e.target.value);
                  }}
                />
              </BoxW>
              <BoxW minWidth="150px" width="10%" p={1}>
                <TextFieldW
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  label={t('pages.tags.tagHeightSize')}
                  value={tagHeightSize}
                  onChange={(e) => setTagHeightSize(e.target.value)}
                />
              </BoxW>
            </BoxW>
            <Box width="55%">
              <FoldingAccordion
                accordionProps={{ elevation: 0 }}
                title="Margens"
                panels={[
                  <Box>
                    <BoxW minWidth="150px" width="100%" p={1}>
                      <Typography>{t('pages.tags.docMargin')}</Typography>
                    </BoxW>
                    <BoxW display="flex" flexDirection="row">
                      <BoxW minWidth="100px" width="45%" p={1}>
                        <TextFieldW
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          label={t('pages.tags.marginTopBottom')}
                          value={marginTopBottom}
                          onChange={(e) => {
                            setMarginTopBottom(e.target.value);
                          }}
                        />
                      </BoxW>
                      <BoxW minWidth="100px" width="45%" p={1}>
                        <TextFieldW
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          label={t('pages.tags.marginLeftRight')}
                          value={marginLeftRight}
                          onChange={(e) => setMarginLeftRight(e.target.value)}
                        />
                      </BoxW>
                    </BoxW>
                    <BoxW minWidth="150px" width="100%" p={1}>
                      <Typography>{t('pages.tags.tagMargin')}</Typography>
                    </BoxW>
                    <BoxW display="flex" flexDirection="row">
                      <BoxW minWidth="100px" width="45%" p={1}>
                        <TextFieldW
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          label={t('pages.tags.marginTopBottom')}
                          value={marginBetweenTagTopBottom}
                          onChange={(e) => {
                            setMarginBetweenTagTopBottom(e.target.value);
                          }}
                        />
                      </BoxW>
                      <BoxW minWidth="100px" width="45%" p={1}>
                        <TextFieldW
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          label={t('pages.tags.marginLeftRight')}
                          value={marginBetweenTagLeftRight}
                          onChange={(e) => setMarginBetweenTagLeftRight(e.target.value)}
                        />
                      </BoxW>
                    </BoxW>
                  </Box>,
                ]}
              />
            </Box>
            <BoxW minWidth="300px" width="40%" p={1}>
              <TextFieldW
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                disabled={selectedIndexes !== ''}
                label={t('pages.tags.startIndex')}
                value={startIndex}
                onChange={(e) => setStartIndex(e.target.value)}
              />
            </BoxW>
            <BoxW width="20%" p={1}>
              <TextFieldW
                disabled={startIndex !== ''}
                label={t('pages.tags.selectedIndexes')}
                value={selectedIndexes}
                onChange={(e) => setSelectedIndexes(e.target.value)}
              />
            </BoxW>
            <BoxW width="20%" p={1}>
              <Selector label={t('pages.tags.pageSize')} value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                {AvailablePageSizes.enums.map((item) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <MenuItem key={item.value} value={item.key}>
                    {item.key}
                  </MenuItem>
                ))}
              </Selector>
            </BoxW>
            <BoxW width="20%" p={1}>
              <ButtonW
                fullWidth
                variant="contained"
                onClick={setOpenTagsPreview}
                disabled={
                  tagHeightSize === 0 ||
                  tagWidthSize === 0 ||
                  tagHeightSize === '' ||
                  tagWidthSize === '' ||
                  tagHeightSize === '0' ||
                  tagWidthSize === '0'
                }
              >
                {t('pages.tags.openPreview')}
              </ButtonW>
              {openTagsPreview && (
                <PreviewTags
                  openDialog={openTagsPreview}
                  setOpenDialog={setOpenTagsPreview}
                  pageSize={selectedPageSize}
                  row={rowSize}
                  col={colSize}
                  tags={selectedTag}
                  selectedUsers={selectedUsers}
                  userData={userData}
                  tagWidth={tagWidthSize}
                  tagHeight={tagHeightSize}
                  margin={{ marginTopBottom, marginLeftRight, marginBetweenTagTopBottom, marginBetweenTagLeftRight }}
                />
              )}
            </BoxW>
          </BoxW>

          {rowSize > 0 && colSize > 0 && (
            <StyledCheckbox
              selectedUsers={selectedUsers}
              userData={userData}
              setSelectedTag={setSelectedTag}
              rowSize={rowSize}
              colSize={colSize}
              selectedIndexes={selectedIndexes}
              startIndex={startIndex}
              caravanData={caravanData}
            />
          )}
        </BoxW>
      }
      buttonErrorText={t('dialog.cancelDeleteDialog')}
    />
  );
};

export default TagFileCreation;
