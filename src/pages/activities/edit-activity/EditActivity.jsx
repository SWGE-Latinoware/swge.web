import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import LinkIcon from '@mui/icons-material/Link';
import { addSeconds, isWithinInterval } from 'date-fns';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { useToast } from '../../../components/context/toast/ToastContext';
import ButtonW from '../../../components/wrapper/ButtonW';
import ActivityService from '../../../services/ActivityService';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import Selector from '../../../components/form-components/Selector';
import ActivityType from '../../../enums/ActivityType';
import EditionType from '../../../enums/EditionType';
import ChipAutoComplete from '../../../components/form-components/ChipAutoComplete';
import useSpeaker from '../../../components/hook/useSpeaker';
import CertificateAutoComplete from '../../../components/form-components/CertificateAutoComplete';
import useCertificate from '../../../components/hook/useCertificate';
import TrackAutoComplete from '../../../components/form-components/TrackAutoComplete';
import useTrack from '../../../components/hook/useTrack';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import Scheduler from '../../../components/scheduler/Scheduler';
import DateUtils from '../../../utils/DateUtils';
import BoxW from '../../../components/wrapper/BoxW';
import FlagSelector from '../../../components/form-components/FlagSelector';
import useFormUtils from '../../../components/hook/useFormUtils';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import { isLecture } from '../list-activities/ActivityList';
import SpaceAutoComplete from '../../../components/form-components/SpaceAutoComplete';
import { useFlux } from '../../../components/context/FluxContext';
import FormGenerics from '../../../components/form-generic/FormGenerics';
import FormDialog, { EDIT_CERTIFICATE, EDIT_INSTITUTION, EDIT_TRACK, USER_LIST } from '../../../components/form-generic/FormDialog';
import MaskFieldW from '../../../components/wrapper/MaskFieldW';
import FormUtils from '../../../utils/FormUtils';
import useLocation from '../../../components/hook/useLocation';
import ObjectUtils from '../../../utils/ObjectUtils';
import useGridCoordinator from '../../../components/hook/useGridCoordinator';

const EditActivity = (props) => {
  const { isInternalPage = false, id: internalID } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { id: idURL } = useParams();
  const { getCertificateById } = useCertificate();
  const { speakerIds, getSpeakerNameById, getSpeakerById } = useSpeaker();
  const { gridCoordinatorIds, getGridCoordinatorById, getGridCoordinatorNameById } = useGridCoordinator();
  const { getTrackById } = useTrack();
  const { validateUniqueEdition, validateMask } = useFormUtils();
  const { currentEdition } = useEditionChange();
  const { activitiesUpdateDate } = useFlux();
  const { formatCurrencySymbol } = useLocation();

  const id = isInternalPage ? internalID : idURL;

  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [descriptionState, setDescriptionState] = useState(undefined);
  const [events, setEvents] = useState([]);
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [lectureMark, setLectureMark] = useState(false);
  const [activities, setActivities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);
  const [fullTrackHash, setFullTrackHash] = useState(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required()
      .test('unique', '', (value) =>
        validateUniqueEdition(ActivityService, 'name', value, 'name', currentEdition?.id, originalUniqueValues?.name === value)
      ),
    type: yup.number().required(),
    // eslint-disable-next-line no-use-before-define
    place: yup.number().test('resourceTimeConflict', '', validateConflicts).required(),
    vacancies: lectureMark ? yup.number().integer().min(0).required() : undefined,
    price: lectureMark ? yup.number().min(0).required() : undefined,
    presentationType: yup.number().required(),
    workload: yup
      .string()
      .ensure()
      .test('match', '', (value) => validateMask(value, 'BR')),
    track: yup.number().required(),
    responsibleUser: yup.number().required(),
    speakers: yup
      .array(yup.number())
      .test('minArray', '', (value) => value.length > 0)
      .required(),
    language: yup.string().required(),
    attendeeCertificate: yup.number().required(),
    speakerCertificate: yup.number().required(),
    placeUrl: yup.string().url().ensure(),
  });

  const { control, handleSubmit, setValue, formState, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const fullTrack = getTrackById(watch('track', undefined));
  const currentType = watch('type', undefined);
  const currentPresentationType = watch('presentationType', '');
  const currentSpace = watch('place', undefined);
  const price = watch('price', undefined);
  const vacancies = watch('vacancies', undefined);

  const isLectureType = useMemo(() => currentType != null && isLecture(ActivityType.getKey(currentType)), [currentType]);

  const eventName = watch('name', '');
  const calendarColor = useMemo(() => fullTrack?.calendarColor, [fullTrack]);

  const finalEvents = useMemo(() => {
    if (eventName !== '' && calendarColor != null && events.length) {
      return events.map(({ start, end, allDay, ...other }) => ({
        ...other,
        start,
        end,
        allDay,
        title: eventName,
        color: calendarColor,
      }));
    }
    return _.clone(events);
  }, [calendarColor, eventName, events]);

  const hasConflict = (activity, schedule, placeId) =>
    activity.schedule.some((newActivitySchedule) => {
      const interval = { start: new Date(newActivitySchedule.startDateTime), end: new Date(newActivitySchedule.endDateTime) };

      const sameTimeBlock = isWithinInterval(new Date(schedule.start), interval) || isWithinInterval(new Date(schedule.end), interval);

      return sameTimeBlock && activity.place?.id === placeId;
    });

  useEffect(
    () =>
      activities.forEach((activity) => {
        const conflict = events.some((event) => hasConflict(activity, event, currentSpace));
        if (conflict) {
          addToast({ body: `${t('toastes.activityPlaceTimeConflict')}: ${activity.name}`, type: 'error' });
        }
      }),
    [activities, addToast, currentSpace, events, t]
  );

  function validateConflicts() {
    return !activities.some((activity) => events.some((event) => hasConflict(activity, event, currentSpace)));
  }

  const renderOnLectureChange = useCallback(
    () => (
      <>
        <BoxW width="15%" p={1} minWidth="200px">
          <Controller
            name="vacancies"
            render={({ field }) => (
              <TextFieldW label={t('pages.editActivity.vacancies')} type="number" {...field} error={errors?.vacancies} required />
            )}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>
        <BoxW width="15%" p={1} minWidth="200px">
          <Controller
            name="price"
            render={({ field }) => (
              <TextFieldW
                label={t('pages.editActivity.price')}
                type="number"
                prefix={formatCurrencySymbol}
                {...field}
                error={errors?.price}
                required
              />
            )}
            control={control}
            rules={{ required: true }}
          />
        </BoxW>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [price, vacancies, control, errors?.price, errors?.vacancies, formatCurrencySymbol, t]
  );

  useEffect(() => {
    if (!currentEdition) return;
    ActivityService.findAllByEdition(currentEdition.id).then((response) => {
      if (response.status === 200) {
        setActivities(_.pullAllBy(response.data, [{ id: parseInt(id, 10) }], 'id'));
        return;
      }
      addToast({ body: t('toastes.fetchError'), type: 'error' });
    });
  }, [addToast, currentEdition, t, activitiesUpdateDate, id]);

  useEffect(() => {
    setLectureMark(!isLectureType);
  }, [isLectureType]);

  useEffect(() => {
    const newHash = ObjectUtils.getHash(fullTrack);
    if (newHash != null && newHash !== fullTrackHash) {
      setFullTrackHash(newHash);
      if (fullTrackHash != null) setEvents([]);
    }
  }, [fullTrack, fullTrackHash, setEvents]);

  const prepareSave = (genericForm) => {
    const form = genericForm;
    form.attendeeCertificate = getCertificateById(form.attendeeCertificate);
    form.speakerCertificate = getCertificateById(form.speakerCertificate);
    form.track = getTrackById(form.track);
    form.place = { id: form.place };
    form.description = descriptionState;

    if (!events.length) {
      addToast({ body: t('toastes.saveNoScheduleError'), type: 'error' });
      return false;
    }
    form.schedule = _.compact(
      events.map(({ title, start, end, allDay, extendedProps }) => {
        const event = {
          title,
          startDateTime: allDay ? DateUtils.getDateWithCurrentTimeZone(start) : start,
          endDateTime: allDay ? DateUtils.getDateWithCurrentTimeZone(end) : end,
          allDay,
          color: fullTrack.calendarColor,
          activity: id && { id },
          id: extendedProps?.originalId,
        };
        const interval = {
          start: new Date(fullTrack.initialDate),
          end: addSeconds(new Date(fullTrack.finalDate), 1),
        };
        if (isWithinInterval(new Date(event.startDateTime), interval) && isWithinInterval(new Date(event.endDateTime), interval)) {
          return event;
        }
        return null;
      })
    );
    const speakers = form.speakers.map((speakerId) => getSpeakerById(speakerId));
    form.speakers = speakers.map((speaker) => ({ speaker, activity: id ? { id } : undefined }));
    form.responsibleUser = getGridCoordinatorById(form.responsibleUser);
    return true;
  };

  const prepareFind = useCallback(
    (responseData) => {
      const uniqueValues = {};
      _.forOwn(responseData, (value, key) => {
        switch (key) {
          case 'name':
            uniqueValues[key] = value;
            setValue(key, value);
            return;
          case 'type':
            setValue(key, ActivityType.getValue(value));
            return;
          case 'presentationType':
            setValue(key, EditionType.getValue(value));
            return;
          case 'track':
          case 'speakerCertificate':
          case 'attendeeCertificate':
          case 'place':
            setValue(key, (value && value.id) || '');
            return;
          case 'responsibleUser':
            setValue(key, (value && value.id) || 0);
            return;
          case 'speakers':
            setValue(key, (value && value.map((speakerActivity) => speakerActivity.speaker.id)) || []);
            return;
          case 'schedule':
            setEvents(
              value.map(({ startDateTime, endDateTime, allDay, title, color, id: idAux }) => ({
                start: startDateTime,
                end: endDateTime,
                allDay,
                title,
                color,
                originalId: idAux,
              }))
            );
            return;
          default:
            setValue(key, value);
        }
      });
      setOriginalUniqueValues(uniqueValues);
    },
    [setValue]
  );

  return (
    <>
      <FormDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        link={link}
        linkProps={{ isInternalPage: true, id: link === EDIT_INSTITUTION ? currentEdition?.institution.id : undefined }}
      />
      <FormGenerics
        title={[
          t('layouts.sidebar.records'),
          { title: t('layouts.sidebar.activities'), url: '/cli/activities' },
          t(`pages.editActivity.toolbar.${id ? 'editActivity' : 'newActivity'}`),
        ]}
        goBack="/cli/activities"
        id={id}
        defaultService={ActivityService}
        handleSubmit={handleSubmit}
        prepareSave={prepareSave}
        prepareFind={prepareFind}
        disableToolbar={isInternalPage}
      >
        <CustomDialog
          dialogProps={{ maxWidth: 'lg' }}
          open={openScheduleDialog}
          onClose={() => setOpenScheduleDialog(false)}
          title={t('pages.editActivity.scheduleDialogTitle')}
          content={
            <BoxW width="100%">
              <Scheduler
                {...{
                  setEvents,
                }}
                events={finalEvents}
                newEventName={eventName}
                newEventBackgroundColor={calendarColor}
                validRange={{
                  start: fullTrack?.initialDate,
                  end: fullTrack?.finalDate,
                }}
              />
            </BoxW>
          }
        />
        <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          {id && (
            <BoxW width="10%" p={1} minWidth="100px">
              <Controller
                name="id"
                render={({ field }) => <TextFieldW label={t('pages.editActivity.id')} {...field} disabled />}
                defaultValue={id}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width={id ? '35%' : '45%'} p={1}>
            <Controller
              name="name"
              render={({ field }) => <TextFieldW label={t('pages.editActivity.name')} {...field} error={errors?.name} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="type"
              render={({ field }) => (
                <Selector label={t('pages.editActivity.type')} {...field} error={errors?.type} required>
                  {ActivityType.enums.map((item) => (
                    <MenuItem key={item.key} value={item.value}>
                      {t(`enums.activityTypes.${item.key}`)}
                    </MenuItem>
                  ))}
                </Selector>
              )}
              defaultValue={ActivityType.getValue('LECTURE')}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="35%" p={1}>
            <Controller
              name="responsibleUser"
              render={({ field }) => (
                <ChipAutoComplete
                  options={gridCoordinatorIds}
                  getOptionLabel={(o) => getGridCoordinatorNameById(o)}
                  label={t('pages.editActivity.responsibleUser')}
                  {...field}
                  inputProps={{
                    error: errors?.responsibleUser,
                    required: true,
                  }}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={USER_LIST}
                  multiple={false}
                />
              )}
              defaultValue={0}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="35%" p={1}>
            <Controller
              name="speakers"
              render={({ field }) => (
                <ChipAutoComplete
                  options={speakerIds}
                  getOptionLabel={(o) => getSpeakerNameById(o)}
                  label={t('pages.editActivity.speaker')}
                  {...field}
                  inputProps={{
                    error: errors?.speakers,
                    required: true,
                  }}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={USER_LIST}
                />
              )}
              defaultValue={[]}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          {!isLectureType && renderOnLectureChange()}
          <BoxW width={isLectureType ? '30%' : '20%'} p={1}>
            <Controller
              name="language"
              render={({ field }) => <TextFieldW label={t('pages.editActivity.language')} {...field} error={errors?.language} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1} minWidth="250px">
            <Controller
              name="languageFlag"
              render={({ field }) => <FlagSelector label={t('pages.editActivity.languageFlag')} disableNoFlags disableDefault {...field} />}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width="30%" p={1}>
            <Controller
              name="presentationType"
              render={({ field }) => (
                <Selector label={t('pages.editActivity.presentationType')} {...field} error={errors?.presentationType} required>
                  {EditionType.enums.map((item) => (
                    <MenuItem key={item.key} value={item.value}>
                      {t(`enums.editionTypes.${item.key}`)}
                    </MenuItem>
                  ))}
                </Selector>
              )}
              defaultValue={EditionType.getValue('LIVE')}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="workload"
              render={({ field }) => (
                <MaskFieldW
                  mask={FormUtils.hourMask}
                  label={t('pages.editActivity.workload')}
                  {...field}
                  error={errors?.workload}
                  required
                />
              )}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width={isLectureType ? '50%' : '40%'} p={1}>
            <Controller
              name="attendeeCertificate"
              render={({ field }) => (
                <CertificateAutoComplete
                  label={t('pages.editActivity.attendeeCertificate')}
                  {...field}
                  inputProps={{
                    error: errors?.attendeeCertificate,
                    required: true,
                  }}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={EDIT_CERTIFICATE}
                />
              )}
              defaultValue=""
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width={isLectureType ? '50%' : '40%'} p={1}>
            <Controller
              name="speakerCertificate"
              render={({ field }) => (
                <CertificateAutoComplete
                  label={t('pages.editActivity.speakerCertificate')}
                  {...field}
                  inputProps={{
                    error: errors?.speakerCertificate,
                    required: true,
                  }}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={EDIT_CERTIFICATE}
                />
              )}
              defaultValue=""
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width={currentPresentationType === EditionType.getValue('LIVE') ? '100%' : '50%'} p={1}>
            <Controller
              name="place"
              render={({ field }) => (
                <SpaceAutoComplete
                  institutionId={currentEdition?.institution?.id}
                  inputProps={{
                    error: errors?.place,
                    required: true,
                  }}
                  label={t('pages.editActivity.place')}
                  {...field}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                />
              )}
              defaultValue=""
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          {currentPresentationType !== EditionType.getValue('LIVE') && (
            <BoxW width="50%" p={1}>
              <Controller
                name="placeUrl"
                render={({ field }) => (
                  <TextFieldW label={t('pages.editActivity.placeUrl')} {...field} prefix={<LinkIcon />} error={errors?.placeUrl} />
                )}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width="60%" p={1}>
            <Controller
              name="track"
              render={({ field }) => (
                <TrackAutoComplete
                  label={t('pages.editActivity.track')}
                  {...field}
                  inputProps={{
                    error: errors?.track,
                    required: true,
                  }}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={EDIT_TRACK}
                />
              )}
              defaultValue=""
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW p={1}>
            <ButtonW primary variant="outlined" disabled={!fullTrack || !currentSpace} onClick={() => setOpenScheduleDialog(true)}>
              {t('pages.editActivity.scheduleDialogTitle')}
            </ButtonW>
          </BoxW>
          <BoxW p={1} width="100%">
            <Controller
              name="description"
              render={({ field }) => (
                <MUIRichTextEditorW
                  media={false}
                  label={t('pages.editActivity.description')}
                  defaultValue={field.value}
                  setDescriptionState={setDescriptionState}
                />
              )}
              control={control}
            />
          </BoxW>
        </BoxW>
      </FormGenerics>
    </>
  );
};

export default EditActivity;
