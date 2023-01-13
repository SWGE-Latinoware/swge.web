import React, { useMemo, useState } from 'react';
import {
  Box, FormControlLabel, IconButton, MenuItem, Tooltip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import PrintIcon from '@mui/icons-material/Print';
import { Controller, useForm } from 'react-hook-form';
import Toolbar from '../../../components/toolbar/Toolbar';
import List from '../../../components/list/List';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import TabsPanel, { getInitialTabIndex } from '../../../components/tabs-panel/TabsPanel';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Selector from '../../../components/form-components/Selector';
import MaskFieldW from '../../../components/wrapper/MaskFieldW';
import SwitchW from '../../../components/wrapper/SwitchW';
import ChipAutoComplete from '../../../components/form-components/ChipAutoComplete';
import { StyledCard } from '../../../components/context/ThemeChangeContext';

const TagList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { index } = useParams();

  const [openDialog, setOpenDialog] = useState(false);
  const [filterType, setFilterType] = useState(-1);
  const [speakerFilterType, setSpeakerFilterType] = useState(-1);
  const [activeTab, setActiveTab] = useState(getInitialTabIndex(index));

  const {
    control,
  } = useForm();

  const columns = useMemo(() => [
    {
      name: 'name',
      label: t('pages.tagList.columns.name'),
      options: {
        filter: true,
      },
    },
    {
      name: 'print',
      label: t('pages.tagList.columns.print'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: () => (
          <Tooltip title={t('pages.tagList.tooltip.print')}>
            <IconButton onClick={() => setOpenDialog(true)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    },
  ], [t]);

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.tagList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/edit-tag')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  const data = [
    ['Etiqueta dos Participantes'],
    ['Etiqueta dos Palestrantes'],
  ];

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.records'),
          t('layouts.sidebar.tags'),
        ]}
        hasArrowBack
      />
      <CustomDialog
        open={openDialog}
        onClose={() => setOpenDialog(!openDialog)}
        buttonOnClick={() => { window.print(); setOpenDialog(!openDialog); }}
        title={t('pages.tagList.dialog.title')}
        content={(
          <Box minWidth="400px" width="100%" flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
            <TabsPanel
              primary
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={[
                { label: 'Inscrições', enabled: true },
                { label: 'Caravanas', enabled: true },
                { label: 'Palestrantes', enabled: true },
              ]}
              panels={[
                (
                  <Box width="100%" flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                    <Box width="100%" p={1}>
                      <Controller
                        name="filter"
                        render={({ field }) => (
                          <Selector
                            label={t('pages.tagList.filter')}
                            {...field}
                            onChange={(e) => setFilterType(e.target.value)}
                          >
                            <MenuItem value={0}>Intervalo de Inscrição</MenuItem>
                            <MenuItem value={1}>Intervalo de Letras</MenuItem>
                            <MenuItem value={2}>Tipo de Inscrição</MenuItem>
                          </Selector>
                        )}
                        control={control}
                      />
                    </Box>
                    {filterType === 0 && (
                      <>
                        <Box width="50%" p={1}>
                          <Controller
                            name="intervalStart"
                            render={({ field }) => (
                              <TextFieldW
                                type="number"
                                label={t('pages.tagList.intervalStart')}
                                {...field}
                              />
                            )}
                            control={control}
                          />
                        </Box>
                        <Box width="50%" p={1}>
                          <Controller
                            name="intervalEnd"
                            render={({ field }) => (
                              <TextFieldW
                                type="number"
                                label={t('pages.tagList.intervalEnd')}
                                {...field}
                              />
                            )}
                            control={control}
                          />
                        </Box>
                      </>
                    )}
                    {filterType === 1 && (
                      <>
                        <Box width="50%" p={1}>
                          <Controller
                            name="letterIntervalStart"
                            render={({ field }) => (
                              <MaskFieldW
                                mask={[/[A-Za-z]/]}
                                label={t('pages.tagList.letterIntervalStart')}
                                {...field}
                              />
                            )}
                            defaultValue=""
                            control={control}
                          />
                        </Box>
                        <Box width="50%" p={1}>
                          <Controller
                            name="letterIntervalEnd"
                            render={({ field }) => (
                              <MaskFieldW
                                mask={[/[A-Za-z]/]}
                                label={t('pages.tagList.letterIntervalEnd')}
                                {...field}
                              />
                            )}
                            defaultValue=""
                            control={control}
                          />
                        </Box>
                      </>
                    )}
                    {filterType === 2 && (
                      <Box width="100%" p={1}>
                        <Controller
                          name="enrollmentType"
                          render={({ field }) => (
                            <Selector
                              label={t('pages.tagList.enrollmentType')}
                              {...field}
                            >
                              <MenuItem value={0}>Participante</MenuItem>
                              <MenuItem value={1}>...</MenuItem>
                            </Selector>
                          )}
                          control={control}
                        />
                      </Box>
                    )}
                    <Box width="100%" p={1}>
                      <FormControlLabel
                        control={(
                          <SwitchW
                            defaultChecked
                            name="generated"
                            size="big"
                            primary
                          />
                              )}
                        label={t('pages.tagList.generated')}
                        labelPlacement="end"
                      />
                    </Box>
                    <Box width="100%" p={1}>
                      <FormControlLabel
                        control={(
                          <SwitchW
                            name="caravans"
                            size="big"
                            primary
                          />
                              )}
                        label={t('pages.tagList.caravans')}
                        labelPlacement="end"
                      />
                    </Box>
                    <Box width="100%" p={1}>
                      <FormControlLabel
                        control={(
                          <SwitchW
                            name="pay"
                            size="big"
                            primary
                          />
                              )}
                        label={t('pages.tagList.pay')}
                        labelPlacement="end"
                      />
                    </Box>
                    <Box width="100%" p={1}>
                      <FormControlLabel
                        control={(
                          <SwitchW
                            name="confirmation"
                            size="big"
                            primary
                          />
                              )}
                        label={t('pages.tagList.confirmation')}
                        labelPlacement="end"
                      />
                    </Box>
                  </Box>
                ),
                (
                  <Box width="100%" flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                    <Box width="100%" p={1}>
                      <ChipAutoComplete
                        options={[{ name: 'Caravana UNIOESTE' }, { name: 'Caravana UENP' }, { name: 'Caravana São Carlos' }]}
                        label={t('pages.tagList.selectedCaravans')}
                        optionName="name"
                      />
                    </Box>
                    <Box width="100%" p={1}>
                      <FormControlLabel
                        control={(
                          <SwitchW
                            defaultChecked
                            name="coordinatorConfirmed"
                            size="big"
                            primary
                          />
                              )}
                        label={t('pages.tagList.coordinatorConfirmed')}
                        labelPlacement="end"
                      />
                    </Box>
                  </Box>
                ),
                (
                  <Box width="100%" flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                    <Box width="100%" p={1}>
                      <Controller
                        name="filterSpeaker"
                        render={({ field }) => (
                          <Selector
                            label={t('pages.tagList.filter')}
                            {...field}
                            onChange={(e) => setSpeakerFilterType(e.target.value)}
                          >
                            <MenuItem value={0}>Todos</MenuItem>
                            <MenuItem value={1}>Palestrantes Específicos</MenuItem>
                          </Selector>
                        )}
                        control={control}
                      />
                    </Box>
                    {speakerFilterType === 1 && (
                      <Box width="100%" p={1}>
                        <ChipAutoComplete
                          options={[{ name: 'Palestrante X' }, { name: 'Palestrante 2' }, { name: 'Palestrante XYZ' }]}
                          label={t('pages.tagList.selectedSpeakers')}
                          optionName="name"
                        />
                      </Box>
                    )}
                  </Box>
                ),
              ]}
            />
          </Box>
          )}
        buttonText={t('pages.tagList.dialog.save')}
      />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <List
            columns={columns}
            options={options}
            data={data}
            textLabelsCod="tagList"
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default TagList;
