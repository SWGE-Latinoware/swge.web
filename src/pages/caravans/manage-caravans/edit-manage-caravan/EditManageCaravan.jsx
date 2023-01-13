import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import _ from 'lodash';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Add, PictureAsPdf } from '@mui/icons-material';
import { differenceInYears, isWithinInterval, parseISO } from 'date-fns';
import EditIcon from 'mdi-react/EditIcon';
import { useToast } from '../../../../components/context/toast/ToastContext';
import CaravanService from '../../../../services/CaravanService';
import Toolbar from '../../../../components/toolbar/Toolbar';
import CaravanType from '../../../../enums/CaravanType';
import FoldingAccordion from '../../../../components/folding-accordion/FoldingAccordion';
import CheckboxW from '../../../../components/wrapper/CheckboxW';
import FormUtils from '../../../../utils/FormUtils';
import useInstitution from '../../../../components/hook/useInstitution';
import CaravanEnrollmentService from '../../../../services/CaravanEnrollmentService';
import CaravanTutoredEnrollmentService from '../../../../services/CaravanTutoredEnrollmentService';
import NoticePanel from '../../../../components/notice-panel/NoticePanel';
import List from '../../../../components/list/List';
import { StyledCard } from '../../../../components/context/ThemeChangeContext';
import CaravanInformationCard from './CaravanInformationCard';
import InsertRegistrationDialog from './InsertRegistrationDialog';
import TutoredUserService from '../../../../services/TutoredUserService';
import { useFlux } from '../../../../components/context/FluxContext';
import ObjectUtils from '../../../../utils/ObjectUtils';
import TutoredCertificateList from './TutoredCertificateList';
import { useEditionChange } from '../../../../components/context/EditionChangeContext';
import NotRegistrationInterval from '../../../errors/not-registration-interval/NotRegistrationInterval';
import FileService from '../../../../services/FileService';
import BoxW from '../../../../components/wrapper/BoxW';
import CustomDialog from '../../../../components/custom-dialog/CustomDialog';
import InsertTutoredUserDialog from './InsertTutoredUserDialog';
import { useUserChange } from '../../../../components/context/UserChangeContext';

const EditManageCaravan = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { id } = useParams();
  const { renderInstitutionName } = useInstitution();
  const { caravansUpdateDate, caravanEnrollmentsUpdateDate, caravanTutoredEnrollmentsUpdateDate } = useFlux();
  const { currentEdition } = useEditionChange();
  const { currentUser } = useUserChange();

  const [caravan, setCaravan] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState(true);
  const [openInsertDialog, setOpenInsertDialog] = useState(false);
  const [caravanHash, setCaravanHash] = useState(null);
  const [displayData, setDisplayData] = useState(null);

  const [previewPDF, setPreviewPDF] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const [openEditTutoredUserAuth, setOpenEditTutoredUserAuth] = useState(false);
  const [editTutoredUser, setEditTutoredUser] = useState(null);
  const [reviewTutoredUser, setReviewTutoredUser] = useState(null);

  const { watch } = useForm();

  const caravanType = useMemo(() => {
    const type = caravan?.type;
    if (type == null) {
      return CaravanType.getValue('GENERAL');
    }
    return CaravanType.getValue(type);
  }, [caravan?.type]);

  const getAccessAttribute = useMemo(() => (caravanType === CaravanType.getValue('GENERAL') ? 'user.' : 'tutoredUser.'), [caravanType]);

  useEffect(() => {
    setUpdateData(true);
  }, [caravansUpdateDate]);

  useEffect(() => {
    if (caravanType === CaravanType.getValue('GENERAL')) {
      setUpdateData(true);
    }
  }, [caravanEnrollmentsUpdateDate, caravanType]);

  useEffect(() => {
    if (caravanType !== CaravanType.getValue('GENERAL')) {
      setUpdateData(true);
    }
  }, [caravanTutoredEnrollmentsUpdateDate, caravanType]);

  useEffect(() => {
    if (id && updateData) {
      setUpdateData(false);
      setLoading(true);
      CaravanService.findOne(id).then((response) => {
        if (response.status === 200) {
          if (response.data == null || response.data === '') {
            addToast({ body: t('toastes.fetchError'), type: 'error' });
            return;
          }
          const newHash = ObjectUtils.getHash(response.data);
          if (caravanHash !== newHash) {
            setCaravanHash(newHash);
            setData([]);
            let updateRegistrations = true;
            _.forOwn(response.data, (value, key) => {
              switch (key) {
                case 'coordinator':
                  response.data[key] = value.name;
                  return;
                case 'institution':
                  response.data[key] = renderInstitutionName(value);
                  return;
                case 'caravanEnrollments':
                case 'caravanTutoredEnrollments':
                  if (updateRegistrations && value.length > 0) {
                    updateRegistrations = false;
                    setData(value);
                  }
                  break;
                default:
                  break;
              }
            });
            setCaravan(response.data);
          }
        } else {
          addToast({ body: t('toastes.fetchError'), type: 'error' });
        }
        setLoading(false);
      });
    }
  }, [addToast, caravanHash, id, renderInstitutionName, t, updateData]);

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

  const handleInsertTutoredParticipant = (formUser) => {
    const form = FormUtils.removeEmptyFields(formUser);
    if (form.id) {
      TutoredUserService.update(form).then((response) => {
        if (response.status === 200) {
          setOpenInsertDialog(false);
          setUpdateData(true);
          addToast({ body: t('toastes.update'), type: 'success' });
        } else {
          addToast({ body: t('toastes.saveError'), type: 'error' });
        }
      });
      return;
    }
    CaravanService.tutoredUserEnrollment(id, form).then((response) => {
      if (response.status === 200) {
        setOpenInsertDialog(false);
        setUpdateData(true);
        addToast({ body: t('toastes.caravanEnrollment'), type: 'success' });
      } else {
        addToast({ body: t('toastes.caravanEnrollmentError'), type: 'error' });
      }
    });
  };

  const handleInsertParticipants = (usersIdx) => {
    CaravanService.userEnrollmentList(id, usersIdx).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.caravanEnrollment'), type: 'success' });
        setOpenInsertDialog(false);
        setUpdateData(true);
      } else {
        addToast({ body: t('toastes.caravanEnrollmentError'), type: 'error' });
      }
    });
  };

  const handleInsertTutoredParticipants = (usersIdx) => {
    CaravanService.tutoredUserEnrollmentList(id, usersIdx).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.caravanEnrollment'), type: 'success' });
        setOpenInsertDialog(false);
        setUpdateData(true);
      } else {
        addToast({ body: t('toastes.caravanEnrollmentError'), type: 'error' });
      }
    });
  };

  const handleAcceptChange = useCallback(
    (dataIndex) => {
      const enrollment = data[dataIndex];
      enrollment.caravan = { id };
      enrollment.accepted = !enrollment.accepted;
      const service = caravanType === CaravanType.getValue('GENERAL') ? CaravanEnrollmentService : CaravanTutoredEnrollmentService;
      service.update(enrollment).then((response) => {
        if (response.status === 200) {
          setUpdateData(true);
        }
      });
    },
    [caravanType, data, id]
  );

  const handlePayChange = useCallback(
    (dataIndex) => {
      const enrollment = data[dataIndex];
      enrollment.caravan = { id };
      enrollment.payed = !enrollment.payed;
      const service = caravanType === CaravanType.getValue('GENERAL') ? CaravanEnrollmentService : CaravanTutoredEnrollmentService;
      service.update(enrollment).then((response) => {
        if (response.status === 200) {
          setUpdateData(true);
        }
      });
    },
    [caravanType, data, id]
  );

  const handlePreview = useCallback(
    (dataIndex) => {
      const obj = data[dataIndex].tutoredUser;
      setReviewTutoredUser(obj);

      FileService.findOne(obj.authorization.id).then((response) => {
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

  const columns = useMemo(
    () => [
      {
        name: `${getAccessAttribute}name`,
        label: t('pages.editManageCaravan.columns.name'),
        options: {
          filter: true,
        },
      },
      ...(caravanType === CaravanType.getValue('GENERAL')
        ? [
            {
              name: `${getAccessAttribute}email`,
              label: t('pages.editManageCaravan.columns.email'),
              options: {
                filter: true,
              },
            },
            {
              name: `${getAccessAttribute}phone`,
              label: t('pages.editManageCaravan.columns.phone'),
              options: {
                filter: false,
                customBodyRender: (value) => (value == null || value === '' ? '-' : value),
              },
            },
          ]
        : []),
      {
        name: `${getAccessAttribute}cellPhone`,
        label: t('pages.editManageCaravan.columns.cellPhone'),
        options: {
          filter: false,
          customBodyRender: (value) => (value == null || value === '' ? '-' : value),
        },
      },
      ...(caravanType === CaravanType.getValue('TUTORED')
        ? [
            {
              name: 'tutoredUser.idNumber',
              label: t('pages.editManageCaravan.columns.idNumber'),
              options: {
                filter: true,
              },
            },
          ]
        : []),
      {
        name: 'payed',
        label: t('pages.editManageCaravan.columns.payed'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customFilterListOptions: {
            render: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customBodyRenderLite: (dataIndex) => {
            if (watch('price', null) === 0) {
              return t('enums.payed.EXEMPTION');
            }
            return <CheckboxW checked={data[dataIndex].payed} primary onClick={() => handlePayChange(dataIndex)} />;
          },
        },
      },
      ...(caravanType === CaravanType.getValue('GENERAL')
        ? [
            {
              name: 'confirmed',
              label: t('pages.editManageCaravan.columns.confirmed'),
              options: {
                filter: true,
                filterOptions: {
                  renderValue: (confirmed) => t(`enums.confirmed.${confirmed ? 'CONFIRMED' : 'NOT_CONFIRMED'}`),
                },
                customFilterListOptions: {
                  render: (confirmed) => t(`enums.confirmed.${confirmed ? 'CONFIRMED' : 'NOT_CONFIRMED'}`),
                },
                customBodyRenderLite: (dataIndex) => t(`enums.confirmed.${data[dataIndex].confirmed ? 'CONFIRMED' : 'NOT_CONFIRMED'}`),
              },
            },
          ]
        : []),
      {
        name: 'accepted',
        label: t('pages.editManageCaravan.columns.accepted'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (accepted) => t(`enums.accepted.${accepted ? 'ACCEPTED' : 'NOT_ACCEPTED'}`),
          },
          customFilterListOptions: {
            render: (accepted) => t(`enums.accepted.${accepted ? 'ACCEPTED' : 'NOT_ACCEPTED'}`),
          },
          customBodyRenderLite: (dataIndex) => (
            <CheckboxW
              checked={data[dataIndex].accepted}
              primary
              onClick={() => handleAcceptChange(dataIndex)}
              disabled={
                data[dataIndex].tutoredUser?.authorization === null &&
                differenceInYears(new Date(), Date.parse(data[dataIndex].tutoredUser.birthDate)) < 18
              }
            />
          ),
        },
      },
      ...(caravanType === CaravanType.getValue('TUTORED')
        ? [
            {
              name: 'preview',
              label: t('pages.editManageCaravan.columns.authorization'),
              options: {
                filter: false,
                customBodyRenderLite: (dataIndex) => (
                  <Tooltip title={t('pages.editManageCaravan.tooltip.preview')}>
                    <IconButton onClick={() => handlePreview(dataIndex)} disabled={data[dataIndex].tutoredUser?.authorization === null}>
                      <PictureAsPdf />
                    </IconButton>
                  </Tooltip>
                ),
              },
            },
            {
              name: 'editAuthorization',
              label: t('pages.editManageCaravan.columns.editAuthorization'),
              options: {
                filter: false,
                customBodyRenderLite: (dataIndex) => (
                  <Tooltip title={t('pages.editManageCaravan.tooltip.preview')}>
                    <IconButton
                      onClick={() => {
                        setEditTutoredUser(data[dataIndex].tutoredUser);
                        setOpenEditTutoredUserAuth(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                ),
              },
            },
          ]
        : []),
    ],
    [caravanType, data, getAccessAttribute, handleAcceptChange, handlePayChange, handlePreview, t, watch]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.editManageCaravan.tooltip.add')}>
        <IconButton onClick={() => setOpenInsertDialog(true)}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  const handleReviewTerm = useCallback(() => {
    reviewTutoredUser.reviewer = currentUser;
    TutoredUserService.update(reviewTutoredUser).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.reviewed'), type: 'success' });
        setOpenPreviewDialog(false);
        setReviewTutoredUser(null);
        return;
      }
      addToast({ body: t('toastes.reviewedError'), type: 'error' });
    });
  }, [addToast, currentUser, reviewTutoredUser, t]);

  return (
    <>
      <CustomDialog
        open={openPreviewDialog}
        onClose={() => {
          setOpenPreviewDialog(!openPreviewDialog);
        }}
        buttonText={reviewTutoredUser?.reviewer === null && t('pages.editManageCaravan.review')}
        buttonOnClick={reviewTutoredUser?.reviewer === null && handleReviewTerm}
        title={`${t('pages.editManageCaravan.authorizationPreview')} [${
          reviewTutoredUser?.reviewer !== null ? t('pages.editManageCaravan.reviewed') : t('pages.editManageCaravan.notReviewed')
        }]`}
        dialogProps={{ maxWidth: 'md' }}
        content={
          previewPDF && (
            <BoxW sx={{ width: '100%', height: '70vh' }}>
              <iframe src={previewPDF} width="100%" height="100%" title="Pré-Visualização" />
              {reviewTutoredUser?.reviewer !== null && (
                <BoxW p={1}>
                  <Typography fontSize={12}>
                    {t('pages.editManageCaravan.whoReview')}: {reviewTutoredUser?.reviewer?.name}
                  </Typography>
                </BoxW>
              )}
            </BoxW>
          )
        }
      />
      <Toolbar
        title={[t('layouts.sidebar.caravans'), t('layouts.sidebar.manageCaravans'), t('pages.editManageCaravan.toolbar.title')]}
        hasArrowBack
      />
      {openEditTutoredUserAuth && (
        <InsertTutoredUserDialog
          openDialog={openEditTutoredUserAuth}
          setOpenDialog={setOpenEditTutoredUserAuth}
          handleInsertTutored={handleInsertTutoredParticipant}
          formData={editTutoredUser}
          setFormData={setEditTutoredUser}
          onlyFile
        />
      )}
      {openInsertDialog && (
        <InsertRegistrationDialog
          caravanType={caravanType}
          openDialog={openInsertDialog}
          setOpenDialog={setOpenInsertDialog}
          handleInsertTutored={handleInsertTutoredParticipants}
          handleInsertSingleTutored={handleInsertTutoredParticipant}
          handleInsertGeneral={handleInsertParticipants}
        />
      )}
      {displayData || displayData === null ? (
        <>
          <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
            <StyledCard p={0} elevation={4}>
              <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                <Box width="100%">{caravan && <CaravanInformationCard formData={caravan} />}</Box>
              </Box>
            </StyledCard>
          </Box>
          {caravanType === CaravanType.getValue('GENERAL') && (
            <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <StyledCard p={0} elevation={4}>
                <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                  <Box width="100%">
                    {caravan && (
                      <FoldingAccordion
                        title={t('pages.editManageCaravan.notices')}
                        panels={[
                          <Box width="100%" minWidth="100%">
                            <NoticePanel
                              allowEdit
                              caravan={{ id, coordinator: { name: caravan.coordinator } }}
                              notices={caravan.notices || []}
                              setUpdateData={setUpdateData}
                            />
                          </Box>,
                        ]}
                      />
                    )}
                  </Box>
                </Box>
              </StyledCard>
            </Box>
          )}
          <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
            <StyledCard p={0} elevation={4}>
              <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                <Box width="100%">
                  <List
                    title={t('pages.editManageCaravan.tableOptions.title')}
                    {...{
                      columns,
                      options,
                      data,
                      isLoading,
                      updateData,
                      setUpdateData,
                      setLoading,
                    }}
                    textLabelsCod="editManageCaravan"
                    defaultService={
                      caravanType === CaravanType.getValue('GENERAL') ? CaravanEnrollmentService : CaravanTutoredEnrollmentService
                    }
                    onRowsDeleteErrorToast="toastes.deleteErrors"
                    onRowsDeleteToast="toastes.deletes"
                    defaultSortOrder={{ name: `${getAccessAttribute}name`, direction: 'asc' }}
                  />
                </Box>
              </Box>
            </StyledCard>
          </Box>
          {caravanType === CaravanType.getValue('TUTORED') && (
            <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <StyledCard p={0} elevation={4}>
                <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                  <Box width="100%">{caravan && <TutoredCertificateList formData={caravan} />}</Box>
                </Box>
              </StyledCard>
            </Box>
          )}
        </>
      ) : (
        <NotRegistrationInterval />
      )}
    </>
  );
};

export default EditManageCaravan;
