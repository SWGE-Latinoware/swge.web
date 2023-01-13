import React, { lazy, Suspense, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import _ from 'lodash';
import SWGEDark from './assets/image/grupo_127.svg';
import SWGELight from './assets/image/grupo_128.svg';
import { Roles } from './components/routes/RouteWithSecurity';
import { useUserChange } from './components/context/UserChangeContext';
import UserRegistration from './pages/secretary/UserRegistration';
import { useThemeChange } from './components/context/ThemeChangeContext';

const RouteWithSecurity = lazy(() => import('./components/routes/RouteWithSecurity'));
const Login = lazy(() => import('./pages/login/Login'));
const Home = lazy(() => import('./pages/home/Home'));
const UserList = lazy(() => import('./pages/users/list-users/UserList'));
const BasicUserTemplate = lazy(() => import('./components/layouts/template/basic-user-template/BasicUserTemplate'));
const EditUser = lazy(() => import('./pages/users/edit-user/EditUser'));
const SatisfactionSurveyList = lazy(() => import('./pages/satisfaction-surveys/list-satisfaction-surveys/SatisfactionSurveyList'));
const EditSatisfactionSurvey = lazy(() => import('./pages/satisfaction-surveys/edit-satisfaction-survey/EditSatisfactionSurvey'));
const AuditList = lazy(() => import('./pages/audit/AuditList'));
const CaravanList = lazy(() => import('./pages/caravans/list-caravans/CaravanList'));
const EditCaravan = lazy(() => import('./pages/caravans/edit-caravan/EditCaravan'));
const ThemeList = lazy(() => import('./pages/themes/list-themes/ThemeList'));
const EditTheme = lazy(() => import('./pages/themes/edit-theme/EditTheme'));
const InternationalizationList = lazy(() => import('./pages/internationalization/list-internationalization/InternationalizationList'));
const EditInternationalization = lazy(() => import('./pages/internationalization/edit-internationalization/EditInternationalization'));
const EditHome = lazy(() => import('./pages/edit-home/EditHome'));
const TemplateList = lazy(() => import('./pages/templates/list-templates/TemplateList'));
const EditTemplate = lazy(() => import('./pages/templates/edit-template/EditTemplate'));
const EmailList = lazy(() => import('./pages/emails/list-emails/EmailList'));
const EditEmail = lazy(() => import('./pages/emails/edit-email/EditEmail'));
const TagList = lazy(() => import('./pages/tags/list-tags/TagList'));
const EditTag = lazy(() => import('./pages/tags/edit-tag/EditTag'));
const CertificateList = lazy(() => import('./pages/certificates/list-certificates/CertificateList'));
const EditCertificate = lazy(() => import('./pages/certificates/edit-certificate/EditCertificate'));
const AutoRegistration = lazy(() => import('./pages/users/auto-registration/AutoRegistration'));
const MyAccount = lazy(() => import('./pages/users/my-account/MyAccount'));
const UserProfile = lazy(() => import('./pages/users/my-account/UserProfile'));
const ResetPassword = lazy(() => import('./pages/users/reset-password/ResetPassword'));
const EditionList = lazy(() => import('./pages/editions/list-editions/EditionList'));
const EditEdition = lazy(() => import('./pages/editions/edit-edition/EditEdition'));
const PageNotFound = lazy(() => import('./pages/errors/not-found/PageNotFound'));
const EditionNotFound = lazy(() => import('./pages/editions/edition-not-found/EditionNotFound'));
const EditionNotEnabled = lazy(() => import('./pages/editions/edition-not-enabled/EditionNotEnabled'));
const ManageCaravanList = lazy(() => import('./pages/caravans/manage-caravans/manage-caravan-list/ManageCaravanList'));
const EditManageCaravan = lazy(() => import('./pages/caravans/manage-caravans/edit-manage-caravan/EditManageCaravan'));
const CaravanRegistrationList = lazy(() =>
  import('./pages/caravans/caravan-registration/list-caravan-registration/CaravanRegistrationList')
);
const InstitutionList = lazy(() => import('./pages/institutions/list-institutions/InstitutionList'));
const EditInstitution = lazy(() => import('./pages/institutions/edit-institution/EditInstitution'));
const EmailConfirmation = lazy(() => import('./pages/users/email-confirmation/EmailConfirmation'));
const TrackList = lazy(() => import('./pages/tracks/list-tracks/TrackList'));
const EditTrack = lazy(() => import('./pages/tracks/edit-track/EditTrack'));
const EditActivity = lazy(() => import('./pages/activities/edit-activity/EditActivity'));
const ActivityList = lazy(() => import('./pages/activities/list-activities/ActivityList'));
const RegistrationList = lazy(() => import('./pages/registrations/list-registrations/RegistrationList'));
const MyRegistration = lazy(() => import('./pages/registrations/my-registration/MyRegistration'));
const EditFeedback = lazy(() => import('./pages/feedbacks/my-feedbacks/edit-feedbacks/EditFeedback'));
const FeedbackList = lazy(() => import('./pages/feedbacks/list-feedbacks/FeedbackList'));
const MyFeedbacks = lazy(() => import('./pages/feedbacks/my-feedbacks/my-feedback/MyFeedbacks'));
const OAuth2RedirectHandler = lazy(() => import('./pages/login/OAuth2RedirectHandler'));
const SpeakerActivityList = lazy(() => import('./pages/speakers/list-speaker-activities/SpeakerActivityList'));
const UserActivities = lazy(() => import('./pages/users/my-activities/UserActivities'));
const MyCertificates = lazy(() => import('./pages/certificates/my-certificates/MyCertificates'));
const GlobalSchedule = lazy(() => import('./pages/activities/global-schedule/GlobalSchedule'));
const CertificateValidation = lazy(() => import('./pages/validation/CertificateValidation'));
const Tags = lazy(() => import('./pages/secretary/Tags'));
const VoucherList = lazy(() => import('./pages/voucher/VoucherList'));
const RegistrationListSecretary = lazy(() => import('./pages/secretary/registrations/RegistrationList'));
const OutsideSystemTerms = lazy(() => import('./pages/terms/OutsideSystemTerms'));
const InsideSystemTerms = lazy(() => import('./pages/terms/InsideSystemTerms'));
const DPOUserList = lazy(() => import('./pages/dpo/UserList'));
const ExclusionRequests = lazy(() => import('./pages/dpo/ExclusionRequests'));

const Routes = () => {
  const { currentUser, isCoordinator, isSpeaker, isSecretary, isDPO } = useUserChange();
  const { currentTheme, prefersDarkMode } = useThemeChange();

  const [isAllowed, setAllowed] = useState(undefined);

  const handlePermission = (roles, mandatoryRoles) => {
    setAllowed(undefined);
    if (roles == null || roles.length === 0) {
      setAllowed(true);
      return;
    }
    const verifyRoles = (role) => {
      switch (role) {
        case Roles.LOGGED_IN:
          if (currentUser === undefined) {
            return true;
          }
          return currentUser !== null;
        case Roles.ADMINISTRATOR:
          if (currentUser === undefined) {
            return true;
          }
          if (currentUser === null) {
            return false;
          }
          return currentUser.admin;
        case Roles.CARAVAN_COORDINATOR:
          if (currentUser === undefined) {
            return true;
          }
          if (currentUser === null) {
            return false;
          }
          return isCoordinator;
        case Roles.COMPLETED:
          if (currentUser === undefined) {
            return true;
          }
          if (currentUser === null) {
            return false;
          }
          return currentUser.completed;
        case Roles.SPEAKER:
          if (currentUser === undefined) {
            return true;
          }
          if (currentUser === null) {
            return false;
          }
          return isSpeaker;
        case Roles.SECRETARY:
          if (currentUser === undefined) {
            return true;
          }
          if (currentUser === null) {
            return false;
          }
          return isSecretary;
        case Roles.DPO:
          if (currentUser === undefined) {
            return true;
          }
          if (currentUser === null) {
            return false;
          }
          return isDPO;
        default:
          return false;
      }
    };
    const finalAllowed = _.some(roles, (role) => verifyRoles(role));
    if (mandatoryRoles != null && mandatoryRoles.length > 0) {
      setAllowed(_.every(mandatoryRoles, (role) => verifyRoles(role)) && finalAllowed);
      return;
    }
    setAllowed(finalAllowed);
  };

  return (
    <Suspense
      fallback={
        <div className="ipl-progress-indicator" id="ipl-progress-indicator">
          <div className="ipl-progress-indicator-head">
            <div className="first-indicator" />
            <div className="second-indicator" />
          </div>
          <div className="insp-logo-frame">
            <svg className="insp-logo-frame-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
              <image href={currentTheme.palette.mode === 'dark' || prefersDarkMode ? SWGELight : SWGEDark} height="100%" width="100%" />
            </svg>
          </div>
        </div>
      }
    >
      <Switch>
        <Route path="/:ed?/terms/:termName" component={OutsideSystemTerms} />
        <Route path="/:ed?/login" component={Login} />
        <Route path="/:ed?/auto-registration" component={AutoRegistration} />
        <Route path="/:ed?/reset-password" component={ResetPassword} />
        <Route path="/:ed?/email-confirmation/:url" component={EmailConfirmation} />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          disableCompletedMandatory
          component={Home}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/home"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          disableCompletedMandatory
          component={UserProfile}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/my-account"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          disableCompletedMandatory
          component={MyAccount}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-account"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          disableCompletedMandatory
          component={MyCertificates}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/my-certificates"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditUser}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/user"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditUser}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/user/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={UserList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/users"
          roles={[Roles.ADMINISTRATOR, Roles.DPO]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={DPOUserList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/dpo/users"
          roles={[Roles.DPO]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditUser}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/dpo/user/:id?"
          roles={[Roles.DPO]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={ExclusionRequests}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/dpo-exclusions"
          roles={[Roles.DPO]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={SatisfactionSurveyList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/satisfaction-surveys"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditSatisfactionSurvey}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/satisfaction-survey"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={AuditList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/audit"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={CaravanList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/caravans"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditCaravan}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/caravan/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={ThemeList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/themes"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={ThemeList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/themes/tab/:index"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditTheme}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/theme/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={InternationalizationList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/internationalization"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditInternationalization}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-internationalization"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditHome}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-home"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditHome}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-home/tab/:index"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={TemplateList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/templates"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditTemplate}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-template"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={TagList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/tags"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditTag}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-tag"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EmailList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/emails"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditEmail}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-email"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={CertificateList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/certificates"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditCertificate}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/certificate/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={RegistrationList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/registrations"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={RegistrationList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/registrations/tab/:index"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditionList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/editions"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditEdition}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edition/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={CaravanRegistrationList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/my-caravans"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={ManageCaravanList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/manage-caravans"
          roles={[Roles.ADMINISTRATOR, Roles.CARAVAN_COORDINATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditManageCaravan}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/manage-caravan/:id"
          roles={[Roles.ADMINISTRATOR, Roles.CARAVAN_COORDINATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={InstitutionList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/institutions"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditInstitution}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/institution/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={TrackList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/tracks"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditTrack}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/track/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={ActivityList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/activities"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={ActivityList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/activities/tab/:index"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={EditActivity}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/activity/:id?"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={MyRegistration}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/my-registration"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={MyRegistration}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/my-registration/tab/:index"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          disableCompletedMandatory
          component={EditFeedback}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/edit-feedback/:id?"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          disableCompletedMandatory
          component={MyFeedbacks}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/my-feedbacks"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={FeedbackList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/feedbacks"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={SpeakerActivityList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/speakers/my-activities"
          roles={[Roles.ADMINISTRATOR, Roles.SPEAKER]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={Tags}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/secretary/tags"
          roles={[Roles.ADMINISTRATOR, Roles.SECRETARY]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={UserRegistration}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/secretary/registration"
          roles={[Roles.ADMINISTRATOR, Roles.SECRETARY]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={Tags}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/secretary/tags/tab/:index"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={RegistrationListSecretary}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/secretary/list-registrations"
          roles={[Roles.ADMINISTRATOR, Roles.SECRETARY]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={RegistrationListSecretary}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/secretary/list-registrations/tab/:index"
          roles={[Roles.ADMINISTRATOR, Roles.SECRETARY]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={UserActivities}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/users/my-activities"
          roles={[Roles.LOGGED_IN, Roles.COMPLETED]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={GlobalSchedule}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/activities/all-activities"
          roles={[Roles.LOGGED_IN]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={VoucherList}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/vouchers"
          roles={[Roles.ADMINISTRATOR]}
        />
        <RouteWithSecurity
          {...{
            isAllowed,
            setAllowed,
            handlePermission,
          }}
          component={InsideSystemTerms}
          exact
          layout={BasicUserTemplate}
          path="/:ed?/cli/terms/:termName"
          roles={[Roles.LOGGED_IN]}
        />
        <Route path="/:ed?/validation/:fragment" component={CertificateValidation} />
        <Route path="/:ed?/error/edition-not-found/:ed?" component={EditionNotFound} />
        <Route path="/:ed?/error/edition-not-enabled/:ed?" component={EditionNotEnabled} />
        <Redirect exact from="/:ed?" to="/login" />
        <Route path="/:ed?/oauth2/redirect/:token/:error" component={OAuth2RedirectHandler} />
        <Route component={PageNotFound} />
      </Switch>
    </Suspense>
  );
};
export default Routes;
