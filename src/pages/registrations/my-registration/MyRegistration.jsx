import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { CalendarToday, RemoveShoppingCart, ShoppingCartCheckout } from '@mui/icons-material';
import { isAfter, isWithinInterval, parseISO } from 'date-fns';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import Toolbar from '../../../components/toolbar/Toolbar';
import { FlexGrow, StyledCard } from '../../../components/context/ThemeChangeContext';
import { useUserChange } from '../../../components/context/UserChangeContext';
import RegistrationService from '../../../services/RegistrationService';
import { useToast } from '../../../components/context/toast/ToastContext';
import ActivityService from '../../../services/ActivityService';
import useLocation from '../../../components/hook/useLocation';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import ActivityCard from './ActivityCard';
import CaravanService from '../../../services/CaravanService';
import { useFlux } from '../../../components/context/FluxContext';
import ObjectUtils from '../../../utils/ObjectUtils';
import { isLecture } from '../../activities/list-activities/ActivityList';
import LecturePackCard from './LecturePackCard';
import BoxW from '../../../components/wrapper/BoxW';
import Scheduler, { filterActivity } from '../../../components/scheduler/Scheduler';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import useTrack from '../../../components/hook/useTrack';
import NotRegistrationInterval from '../../errors/not-registration-interval/NotRegistrationInterval';
import CaravanEnrollmentService from '../../../services/CaravanEnrollmentService';
import NotCaravanPay from '../../errors/not-caravan-pay/NotCaravanPay';
import Payment from './Payment';

const MyRegistration = () => {
  const { currentEdition } = useEditionChange();
  const { t } = useTranslation();
  const { currentUser } = useUserChange();
  const { addToast } = useToast();
  const { formatCurrency } = useLocation();
  const { registrationsUpdateDate } = useFlux();
  const { handleValidRange } = useTrack();

  const [registrationData, setRegistrationData] = useState(undefined);
  const [activities, setActivities] = useState([]);
  const [activitiesPrice, setActivitiesPrice] = useState(0);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [updateRegistration, setUpdateRegistration] = useState(true);
  const [displayData, setDisplayData] = useState(null);
  const [registrationTypePrice, setRegistrationTypePrice] = useState(0);
  const [userCaravans, setUserCaravans] = useState([]);
  const [idealCardHeight, setIdealCardHeight] = useState(0);
  const [conflictedActivities, setConflictedActivities] = useState([]);
  const [conflictedActivitiesOnLectures, setConflictedActivitiesOnLectures] = useState([]);
  const [filter, setFilter] = useState({});
  const [openPayment, setOpenPayment] = useState(false);

  const id = registrationData?.id;

  const currentRegistrationHash = useMemo(() => ObjectUtils.getHash(registrationData), [registrationData]);

  const nonLectures = useMemo(() => activities.filter((activity) => !isLecture(activity.type)), [activities]);
  const lectures = useMemo(() => activities.filter((activity) => isLecture(activity.type)), [activities]);

  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [events, setEvents] = useState(false);

  const [displayCaravan, setDisplayCaravan] = useState(null);

  const [paymentStatus, setPaymentStatus] = useState(undefined);

  const { control } = useForm({
    mode: 'onBlur',
    defaultValues: registrationData,
  });

  const onCardHeightChange = (height) => {
    if (height > idealCardHeight) {
      setIdealCardHeight(height);
    }
  };

  const totalPrice = useMemo(() => {
    if (id) {
      return registrationData.finalPrice;
    }
    return registrationTypePrice + activitiesPrice;
  }, [activitiesPrice, id, registrationData?.finalPrice, registrationTypePrice]);

  useEffect(() => {
    setUpdateRegistration(true);
  }, [registrationsUpdateDate]);

  useEffect(() => {
    if (id) {
      const checkRegistration = setInterval(() => {
        if (registrationData?.payed) clearInterval(checkRegistration);
        else setUpdateRegistration(true);
      }, 300000);
    }
  }, [id, registrationData?.payed]);

  useEffect(() => {
    if (!currentEdition || !currentUser || !updateRegistration) return;
    setUpdateRegistration(false);
    RegistrationService.findOneByEditionAndUser(currentEdition.id, currentUser.id).then((response) => {
      if (response.status === 200) {
        if (response.data == null || response.data === '') {
          addToast({ body: t('toastes.fetchError'), type: 'error' });
          return;
        }
        const newHash = ObjectUtils.getHash(response.data);
        if (newHash !== currentRegistrationHash) {
          setRegistrationData(response.data);
        }
        return;
      }
      if (response.status === 404) {
        setRegistrationData(undefined);
        return;
      }
      addToast({ body: t('toastes.fetchError'), type: 'error' });
    });
  }, [addToast, currentEdition, currentRegistrationHash, currentUser, t, updateRegistration]);

  useEffect(() => {
    if (!currentEdition) return;
    ActivityService.findAllByEdition(currentEdition.id).then((response) => {
      if (response.status === 200) {
        setActivities(response.data);
        return;
      }
      addToast({ body: t('toastes.fetchError'), type: 'error' });
    });
  }, [addToast, currentEdition, t]);

  const hasConflict = (activity, schedule) =>
    activity.schedule.some((newActivitySchedule) => {
      const interval = {
        start: new Date(newActivitySchedule.startDateTime),
        end: new Date(newActivitySchedule.endDateTime),
      };

      return isWithinInterval(new Date(schedule.startDateTime), interval) || isWithinInterval(new Date(schedule.endDateTime), interval);
    });

  const handleActivitySelection = (activity, selected) => {
    let totalPriceAux = activitiesPrice;

    if (selected) {
      totalPriceAux += activity.price;
      selectedActivities.push(activity);

      lectures.forEach((activLecture) => {
        selectedActivities.forEach((activ) => {
          activLecture.schedule.forEach((scheduled) => {
            const indexLecture = _.findIndex(conflictedActivitiesOnLectures, {
              activity1: activ,
              activity2: activLecture,
            });
            const indexAct = _.findIndex(conflictedActivities, { activity1: activ, activity2: activLecture });
            if (hasConflict(activ, scheduled) && indexLecture === -1 && indexAct === -1) {
              conflictedActivitiesOnLectures.push({ activity1: activ, activity2: activLecture });
              conflictedActivities.push({ activity1: activ, activity2: activLecture });
            }
          });
        });
      });

      selectedActivities.forEach((activOne) => {
        selectedActivities.forEach((activTwo) => {
          if (activOne.id !== activTwo.id) {
            const indexV1 = _.findIndex(conflictedActivities, { activity1: activOne, activity2: activTwo });
            const indexV2 = _.findIndex(conflictedActivities, { activity1: activTwo, activity2: activOne });
            if (activTwo.schedule.some((schedule) => hasConflict(activOne, schedule)) && indexV1 === -1 && indexV2 === -1) {
              conflictedActivities.push({ activity1: activOne, activity2: activTwo });
            }
          }
        });
      });
    } else {
      totalPriceAux -= activity.price;

      lectures.forEach((activLecture) => {
        _.pullAllWith(
          conflictedActivitiesOnLectures,
          [
            {
              activity1: activity,
              activity2: activLecture,
            },
          ],
          _.isEqual
        );
        _.pullAllWith(conflictedActivities, [{ activity1: activity, activity2: activLecture }], _.isEqual);
      });

      selectedActivities.forEach((activTwo) => {
        if (activity.id !== activTwo.id) {
          if (activTwo.schedule.some((schedule) => hasConflict(activity, schedule))) {
            _.pullAllWith(conflictedActivities, [{ activity1: activity, activity2: activTwo }], _.isEqual);
            _.pullAllWith(conflictedActivities, [{ activity1: activTwo, activity2: activity }], _.isEqual);
          }
        }
      });
      _.pull(selectedActivities, activity);
    }

    if (conflictedActivities.length > 0 || conflictedActivitiesOnLectures.length > 0) {
      addToast({ body: t('toastes.selectWarning'), type: 'warning' });
    }

    setActivitiesPrice(totalPriceAux);
    setConflictedActivitiesOnLectures(conflictedActivitiesOnLectures);
    setConflictedActivities(conflictedActivities);
    setSelectedActivities(selectedActivities);
  };

  const handleRegistration = () => {
    if (currentEdition && currentUser) {
      const form = {
        edition: currentEdition,
        user: currentUser,
        individualRegistrations: selectedActivities.map((activity) => ({ activity: { id: activity.id } })),
      };
      RegistrationService.create(form).then((response) => {
        if (response.status === 200) {
          addToast({ body: t('toastes.save'), type: 'success' });
          setUpdateRegistration(true);
          if (!response.data.payed) {
            setOpenPayment(true);
          } else if (response.data.payed && response.data.finalPrice === 0.0) {
            setPaymentStatus(t('pages.myRegistration.payment.paymentStatus.voucherFound'));
          }
        } else if (response.status >= 400 && response.status <= 500) {
          addToast({ body: t('toastes.saveError'), type: 'error' });
        }
      });
    }
  };

  const handleRegistrationCancellation = () => {
    RegistrationService.cancelPayment(id).then((resp) => {
      if (resp.status === 200) {
        setPaymentStatus(t('pages.myRegistration.payment.paymentStatus.cancelSuccess'));
        addToast({ body: t('toastes.chargeCancel'), type: 'success' });
        RegistrationService.cancelRegistration(id).then((response) => {
          if (response.status === 200) {
            addToast({ body: t('toastes.delete'), type: 'success' });
            setUpdateRegistration(true);
            setActivitiesPrice(0);
            setConflictedActivities([]);
            setConflictedActivitiesOnLectures([]);
            setSelectedActivities([]);
          } else if (response.status >= 400 && response.status <= 500) {
            addToast({ body: t('toastes.deleteError'), type: 'error' });
          }
        });
        return;
      }
      addToast({ body: t('toastes.deleteError'), type: 'error' });
    });
  };

  const handleFilter = useCallback((filterAux) => {
    setFilter(filterAux);
  }, []);

  const filterGlobalCalendar = useCallback(() => {
    setEvents(
      activities.flatMap((activity) => {
        const { schedule } = activity;
        if (filterActivity(activity, filter)) {
          return schedule.map(({ startDateTime, endDateTime, allDay, title, color }) => ({
            start: startDateTime,
            end: endDateTime,
            allDay,
            title,
            color,
          }));
        }
        return [];
      })
    );
  }, [activities, filter]);

  useEffect(() => {
    filterGlobalCalendar();
  }, [filterGlobalCalendar]);

  const handleCalendar = () => {
    setOpenScheduleDialog(true);
    filterGlobalCalendar();
  };

  useEffect(() => {
    if (currentEdition && currentUser) {
      CaravanService.findAllByEditionAndUser(currentEdition.id, currentUser.id).then((response) => {
        if (response.status === 200) {
          setUserCaravans(response.data);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, currentUser, t]);

  useEffect(() => {
    if (id) {
      setDisplayData(true);
      setDisplayCaravan(true);
      return;
    }
    if (!currentEdition) {
      setDisplayData(null);
      setDisplayCaravan(null);
      return;
    }
    if (!currentUser) {
      setDisplayCaravan(null);
    } else {
      CaravanEnrollmentService.verifyCaravanNotPay(currentEdition.id, currentUser.id).then((response) => {
        if (response.status === 200) {
          setDisplayCaravan(response.data);
          return;
        }
        setDisplayCaravan(null);
      });
    }
    const registrationType = currentEdition?.registrationType;
    if (!registrationType) {
      setDisplayData(false);
      addToast({ body: t('toastes.noRegistrationType'), type: 'error' });
      return;
    }
    if (
      !isWithinInterval(new Date(), {
        start: parseISO(registrationType.initialDateTime),
        end: parseISO(registrationType.finalDateTime),
      })
    ) {
      setDisplayData(false);
      addToast({ body: t('toastes.noRegistrationTypeInterval'), type: 'error' });
      return;
    }
    const prices = [registrationType.price];
    if (userCaravans.length > 0 && currentUser) {
      const able = userCaravans.some(({ caravanEnrollments }) =>
        caravanEnrollments.some(
          (enrollment) => enrollment.user.id === currentUser.id && enrollment.confirmed && enrollment.accepted && enrollment.payed
        )
      );
      if (able) {
        prices.push(0);
      }
    }
    if (registrationType.promotions?.length > 0) {
      registrationType.promotions
        .filter((promotion) => !promotion.isVoucher)
        .forEach((promotion) => {
          if (
            isWithinInterval(new Date(), {
              start: parseISO(promotion.initialDateTime),
              end: parseISO(promotion.finalDateTime),
            }) &&
            promotion.remainingVacancies > 0
          ) {
            prices.push(registrationType.price - registrationType.price * (promotion.percentage / 100));
          }
        });
    }
    const finalPrice = _.min(prices);
    setRegistrationTypePrice(finalPrice);
    setDisplayData(true);
  }, [addToast, currentEdition, currentUser, id, t, userCaravans]);

  return (
    <>
      <CustomDialog
        dialogProps={{ maxWidth: 'lg' }}
        open={openScheduleDialog}
        onClose={() => setOpenScheduleDialog(false)}
        title={t('pages.myRegistration.scheduleTitle')}
        content={
          <BoxW width="100%">
            <Scheduler
              {...{
                events,
                setEvents,
              }}
              readOnly
              validRange={handleValidRange}
              filter={handleFilter}
            />
          </BoxW>
        }
      />
      {openPayment && (
        <Payment
          totalPrice={totalPrice}
          products={selectedActivities}
          defaultPrice={registrationTypePrice}
          openModal={openPayment}
          setOpenModal={setOpenPayment}
          regId={id}
          cancel={handleRegistrationCancellation}
          setPaymentStatus={setPaymentStatus}
        />
      )}
      <CustomDialog
        open={!openPayment && paymentStatus}
        onClose={() => {
          setPaymentStatus(undefined);
        }}
        title={t('pages.myRegistration.payment.paymentStatus.title')}
        content={
          <BoxW width="100%">
            <Typography>{paymentStatus}</Typography>
          </BoxW>
        }
      />
      <Toolbar title={[t('layouts.sidebar.enrollments'), t('layouts.sidebar.myRegistration')]} urls="/cli/users" hasArrowBack />
      {/* eslint-disable-next-line no-nested-ternary */}
      {displayData || displayData === null ? (
        displayCaravan || displayCaravan === null ? (
          <>
            <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" padding="24px">
              <StyledCard elevation={4}>
                <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                  <Tooltip title={t('pages.myRegistration.tooltip.calendar')}>
                    <IconButton onClick={handleCalendar}>
                      <CalendarToday />
                    </IconButton>
                  </Tooltip>
                  {id && (
                    <Box width="10%" p={1}>
                      <Controller
                        name="id"
                        render={({ field }) => <TextFieldW label={t('pages.myRegistration.id')} {...field} disabled />}
                        defaultValue={id}
                        control={control}
                      />
                    </Box>
                  )}
                  <FlexGrow />
                  {id && (
                    <>
                      <Box display="flex" flexWrap="wrap" flexDirection="row" p={1} gap="5px">
                        <Typography fontWeight="bold">{`${t('pages.myRegistration.status')}:`}</Typography>
                        <Typography
                          sx={(theme) => ({ color: registrationData.payed ? theme.palette.success.main : theme.palette.error.main })}
                        >
                          {registrationData.payed ? t('pages.myRegistration.payed') : t('pages.myRegistration.notPayed')}
                        </Typography>
                      </Box>
                      <FlexGrow />
                    </>
                  )}
                  {!id && (
                    <>
                      <Box display="flex" flexWrap="wrap" flexDirection="row" p={1}>
                        <Box paddingRight={1}>
                          <Typography fontWeight="bold">{`${t('pages.myRegistration.registrationTypePrice')}:`}</Typography>
                        </Box>
                        <Box>
                          <Typography>{formatCurrency(registrationTypePrice)}</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" flexWrap="wrap" flexDirection="row" p={1}>
                        +
                      </Box>
                      <Box display="flex" flexWrap="wrap" flexDirection="row" p={1}>
                        <Box paddingRight={1}>
                          <Typography fontWeight="bold">{`${t('pages.myRegistration.activitiesPrice')}:`}</Typography>
                        </Box>
                        <Box>
                          <Typography>{formatCurrency(activitiesPrice)}</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" flexWrap="wrap" flexDirection="row" p={1}>
                        =
                      </Box>
                    </>
                  )}
                  <Box display="flex" flexWrap="wrap" flexDirection="row" p={1}>
                    <Box paddingRight={1}>
                      <Typography fontWeight="bold">{`${t('pages.myRegistration.totalPrice')}:`}</Typography>
                    </Box>
                    <Box>
                      <Typography>{formatCurrency(totalPrice)}</Typography>
                    </Box>
                  </Box>
                  {!id && (
                    <Box p={1}>
                      <IconButton
                        size="large"
                        onClick={() => {
                          handleRegistration();
                        }}
                      >
                        <ShoppingCartCheckout />
                      </IconButton>
                    </Box>
                  )}
                  {id &&
                    (!isAfter(new Date(), new Date(currentEdition.initialDate)) ||
                      (isAfter(new Date(), new Date(currentEdition.initialDate)) && !registrationData.payed)) && (
                      <Box p={1}>
                        <IconButton size="large" onClick={handleRegistrationCancellation}>
                          <RemoveShoppingCart />
                        </IconButton>
                      </Box>
                    )}
                </Box>
              </StyledCard>
            </Box>
            <Box
              p={2}
              display="flex"
              flexWrap="wrap"
              alignItems="stretch"
              sx={() => ({
                listStyle: 'none',
                paddingTop: '0px',
              })}
            >
              {id
                ? activities.map((activity) => {
                    const userActivities = registrationData.individualRegistrations.map((a) => a.activity.id);
                    if (_.find(userActivities, (a) => activity.id === a)) {
                      return (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          readOnly
                          onCardHeightChange={onCardHeightChange}
                          idealCardHeight={idealCardHeight}
                        />
                      );
                    }
                    return undefined;
                  })
                : [
                    <LecturePackCard
                      key={0}
                      activity={{
                        name: t('pages.myRegistration.lecturePackCard.title'),
                        price: registrationTypePrice,
                        description: {
                          entityMap: {},
                          blocks: [
                            {
                              key: 'cthj4',
                              text: '',
                              type: 'unstyled',
                              depth: 0,
                              inlineStyleRanges: [],
                              entityRanges: [],
                              data: {},
                            },
                          ],
                        },
                      }}
                      activities={lectures}
                      onCardHeightChange={onCardHeightChange}
                      idealCardHeight={idealCardHeight}
                      conflicts={conflictedActivitiesOnLectures}
                    />,
                  ].concat(
                    nonLectures.map((activity) => {
                      if (activity.remainingVacancies > 0) {
                        return (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onCheck={handleActivitySelection}
                            onCardHeightChange={onCardHeightChange}
                            idealCardHeight={idealCardHeight}
                            conflicts={conflictedActivities}
                          />
                        );
                      }
                      return undefined;
                    })
                  )}
            </Box>
          </>
        ) : (
          <NotCaravanPay />
        )
      ) : (
        <NotRegistrationInterval />
      )}
    </>
  );
};

export default MyRegistration;
