import React, { useMemo } from 'react';
import { Box, Divider, Drawer, Hidden, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AddHome,
  BugReport,
  Business,
  CalendarMonth,
  Create as CreateIcon,
  DirectionsBus as DirectionsBusIcon,
  Error,
  Event as EventIcon,
  EventSeat,
  Feedback,
  Home as HomeIcon,
  HowToReg,
  InvertColors as InvertColorsIcon,
  List,
  LocalOffer,
  Palette as PaletteIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  PersonRemove,
  School as SchoolIcon,
  SupervisorAccount,
} from '@mui/icons-material';
import CalendarStarIcon from 'mdi-react/CalendarStarIcon';
import HumanMaleBoardIcon from 'mdi-react/HumanMaleBoardIcon';
import MessageCogIcon from 'mdi-react/MessageCogIcon';
import AccountGroupIcon from 'mdi-react/AccountGroupIcon';
import VoucherIcon from 'mdi-react/VoucherIcon';
import FileDocumentIcon from 'mdi-react/FileDocumentIcon';
import AccountTieIcon from 'mdi-react/AccountTieIcon';
import SidebarNav from '../sidebarNav/SidebarNav';
import { useUserChange } from '../../context/UserChangeContext';
import { useEditionChange } from '../../context/EditionChangeContext';
import TrackIconSvg from '../../icon-svg-styles/TrackIconSvg';

const Sidebar = (props) => {
  const { open, variant, onClick, onClose } = props;

  const { currentUser, isCoordinator, isSpeaker, isSecretary, isDPO } = useUserChange();
  const { t } = useTranslation();
  const { renderUrl } = useEditionChange();

  const myAccountEntry = useMemo(() => {
    let Icon = PersonIcon;
    if (currentUser?.completed != null && !currentUser.completed) {
      Icon = Error;
    }
    return {
      title: (
        <Typography
          variant="body2"
          sx={(theme) => ({
            color: currentUser?.completed != null && !currentUser.completed ? theme.palette.error.main : undefined,
          })}
        >
          {t('layouts.sidebar.myAccount')}
        </Typography>
      ),
      href: renderUrl('/cli/my-account'),
      icon: (
        <Icon
          sx={(theme) => ({
            color: currentUser?.completed != null && !currentUser.completed ? theme.palette.error.main : undefined,
          })}
        />
      ),
    };
  }, [currentUser?.completed, renderUrl, t]);

  const administrator = [
    {
      title: <Typography variant="body2">{t('layouts.sidebar.dashboard')}</Typography>,
      href: renderUrl('/home'),
      icon: <HomeIcon />,
    },
    myAccountEntry,
    ...(currentUser?.completed
      ? [
          {
            title: <Typography variant="body2">{t('layouts.sidebar.myCertificates')}</Typography>,
            href: renderUrl('/cli/my-certificates'),
            icon: <SchoolIcon />,
          },
        ]
      : []),
    ...((currentUser?.admin || isSecretary) && currentUser?.completed
      ? [
          {
            accordionName: <Typography variant="body2">{t('layouts.sidebar.secretary')}</Typography>,
            icon: <List />,
            accordion: [
              {
                title: t('layouts.sidebar.tags'),
                href: renderUrl('/cli/secretary/tags'),
                icon: <LocalOffer />,
              },
              {
                title: t('layouts.sidebar.userRegistration'),
                href: renderUrl('/cli/secretary/registration'),
              },
              {
                title: t('layouts.sidebar.registrations'),
                href: renderUrl('/cli/secretary/list-registrations'),
                otherRefs: ['/cli/secretary/list-registrations/tab/:index'],
                icon: <AccountGroupIcon />,
              },
            ],
          },
        ]
      : []),
    ...(currentUser?.admin && currentUser?.completed
      ? [
          {
            accordionName: <Typography variant="body2">{t('layouts.sidebar.records')}</Typography>,
            icon: <CreateIcon />,
            accordion: [
              {
                title: t('layouts.sidebar.users'),
                href: renderUrl('/cli/users'),
                otherRefs: ['/cli/user', '/cli/user/:id'],
                icon: <PeopleIcon />,
              },
              ...(isDPO
                ? [
                    {
                      title: t('layouts.sidebar.tutoredUsers'),
                      href: renderUrl('/cli/tutored-users'),
                      otherRefs: ['/cli/tutored-user'],
                      icon: <PeopleIcon />,
                    },
                  ]
                : []),
              {
                title: t('layouts.sidebar.caravans'),
                href: renderUrl('/cli/caravans'),
                otherRefs: ['/cli/caravan', '/cli/caravan/:id'],
                icon: <DirectionsBusIcon />,
              },
              {
                title: t('layouts.sidebar.institutions'),
                href: renderUrl('/cli/institutions'),
                otherRefs: ['/cli/institution', '/cli/institution/:id'],
                icon: <Business />,
              },
              {
                title: t('layouts.sidebar.editions'),
                href: renderUrl('/cli/editions'),
                otherRefs: ['/cli/edition', '/cli/edition/:id'],
                icon: <EventIcon />,
              },
              {
                title: t('layouts.sidebar.activities'),
                href: renderUrl('/cli/activities'),
                otherRefs: ['/cli/activity', '/cli/activity/:id', '/cli/activities/tab/:index'],
                icon: <List />,
              },
              {
                title: t('layouts.sidebar.tracks'),
                href: renderUrl('/cli/tracks'),
                otherRefs: ['/cli/track', '/cli/track/:id'],
                icon: <TrackIconSvg />,
              },
              {
                title: t('layouts.sidebar.certificates'),
                href: renderUrl('/cli/certificates'),
                otherRefs: ['/cli/certificate', '/cli/certificate/:id'],
                icon: <SchoolIcon />,
              },
              {
                title: t('layouts.sidebar.voucher'),
                href: renderUrl('/cli/vouchers'),
                otherRefs: ['/cli/voucher', '/cli/voucher/:id'],
                icon: <VoucherIcon />,
              },
              // {
              //   title: t('layouts.sidebar.tags'),
              //   href: '/cli/tags',
              //   otherRefs: ['/cli/edit-tag'],
              //   icon: <ContactMailIcon />,
              // },
              // {
              //   title: t('layouts.sidebar.satisfactionSurveys'),
              //   href: '/cli/satisfaction-surveys',
              //   otherRefs: ['/cli/satisfaction-survey'],
              //   icon: <EqualizerIcon />,
              // },
            ],
          },
        ]
      : []),
    ...(currentUser?.completed
      ? [
          {
            accordionName: <Typography variant="body2">{t('layouts.sidebar.caravans')}</Typography>,
            icon: <DirectionsBusIcon />,
            accordion: [
              ...(currentUser?.admin || isCoordinator
                ? [
                    {
                      title: t('layouts.sidebar.manageCaravans'),
                      href: renderUrl('/cli/manage-caravans'),
                      otherRefs: ['/cli/manage-caravan/:id'],
                      icon: <SupervisorAccount />,
                    },
                  ]
                : []),
              {
                title: t('layouts.sidebar.myCaravans'),
                href: renderUrl('/cli/my-caravans'),
                otherRefs: ['/cli/my-caravans', '/cli/my-caravan/:id'],
                icon: <HowToReg />,
              },
            ],
          },
          {
            accordionName: <Typography variant="body2">{t('layouts.sidebar.enrollments')}</Typography>,
            icon: <EventSeat />,
            accordion: [
              ...(currentUser?.admin
                ? [
                    {
                      title: t('layouts.sidebar.registrations'),
                      href: renderUrl('/cli/registrations'),
                      otherRefs: ['/cli/registrations/tab/:index'],
                      icon: <AccountGroupIcon />,
                    },
                  ]
                : []),
              {
                title: t('layouts.sidebar.myRegistration'),
                href: renderUrl('/cli/my-registration'),
                otherRefs: ['/cli/my-registration', '/cli/my-registration/tab/:index'],
                icon: <HowToReg />,
              },
            ],
          },
        ]
      : []),
    ...(currentUser?.completed
      ? [
          {
            accordionName: <Typography variant="body2">{t('layouts.sidebar.activities')}</Typography>,
            icon: <List />,
            accordion: [
              {
                title: t('layouts.sidebar.allActivities'),
                href: renderUrl('/cli/activities/all-activities'),
                otherRefs: [],
                icon: <CalendarMonth />,
              },
              ...(currentUser?.admin || isSpeaker
                ? [
                    {
                      title: t('layouts.sidebar.speakerActivities'),
                      href: renderUrl('/cli/speakers/my-activities'),
                      otherRefs: [],
                      icon: <HumanMaleBoardIcon />,
                    },
                  ]
                : []),

              {
                title: t('layouts.sidebar.userActivities'),
                href: renderUrl('/cli/users/my-activities'),
                otherRefs: [],
                icon: <CalendarStarIcon />,
              },
            ],
          },
        ]
      : []),
    // {
    //   accordionName: t('layouts.sidebar.communication'),
    //   icon: <MarkunreadMailboxIcon />,
    //   accordion: [
    //     {
    //       title: t('layouts.sidebar.emails'),
    //       href: '/cli/emails',
    //       otherRefs: ['/cli/edit-email'],
    //       icon: <EmailIcon />,
    //     },
    //   ],
    // },
    // {
    //   title: t('layouts.sidebar.templates'),
    //   href: '/cli/templates',
    //   otherRefs: ['/cli/edit-template'],
    // },
    ...(currentUser?.admin && currentUser?.completed
      ? [
          {
            accordionName: <Typography variant="body2">{t('layouts.sidebar.customization')}</Typography>,
            icon: <PaletteIcon />,
            accordion: [
              {
                title: t('layouts.sidebar.themes'),
                href: renderUrl('/cli/themes'),
                otherRefs: ['/cli/theme', '/cli/theme/:id', '/cli/themes/tab/:index'],
                icon: <InvertColorsIcon />,
              },
              {
                title: t('layouts.sidebar.home'),
                href: '/cli/edit-home',
                icon: <AddHome />,
              },
              // {
              //   title: t('layouts.sidebar.internationalization'),
              //   href: '/cli/internationalization',
              //   otherRefs: ['/cli/edit-internationalization'],
              //   icon: <PublicIcon />,
              // },
            ],
          },
        ]
      : []),
    // {
    //   title: t('layouts.sidebar.audit'),
    //   href: '/cli/audit',
    // },
    {
      accordionName: <Typography variant="body2">{t('layouts.sidebar.feedback')}</Typography>,
      icon: <Feedback />,
      accordion: [
        ...(currentUser?.admin && currentUser?.completed
          ? [
              {
                title: t('layouts.sidebar.feedbacks'),
                href: renderUrl('/cli/feedbacks'),
                otherRefs: [],
                icon: <MessageCogIcon />,
              },
            ]
          : []),
        {
          title: t('layouts.sidebar.myFeedbacks'),
          href: renderUrl('/cli/my-feedbacks'),
          otherRefs: [],
          icon: <BugReport />,
        },
      ],
    },
    {
      accordionName: <Typography variant="body2">{t('layouts.sidebar.terms')}</Typography>,
      icon: <FileDocumentIcon />,
      accordion: [
        {
          title: t('layouts.sidebar.privacyPolicy'),
          href: renderUrl('/cli/terms/privacy-policy'),
          otherRefs: [],
        },
        {
          title: t('layouts.sidebar.useTerm'),
          href: renderUrl('/cli/terms/use-term'),
          otherRefs: [],
        },
        {
          title: t('layouts.sidebar.imageTerm'),
          href: renderUrl('/cli/terms/image-term'),
          otherRefs: [],
        },
        {
          title: t('layouts.sidebar.authorizationTerm'),
          href: renderUrl('/cli/terms/authorization-term'),
          otherRefs: [],
        },
        {
          title: t('layouts.sidebar.apiUseTerm'),
          href: renderUrl('/cli/terms/api-use-term'),
          otherRefs: [],
        },
      ],
    },
  ];

  const dpo = [
    {
      title: <Typography variant="body2">{t('layouts.sidebar.dashboard')}</Typography>,
      href: renderUrl('/home'),
      icon: <HomeIcon />,
    },
    myAccountEntry,
    {
      accordionName: <Typography variant="body2">{t('layouts.sidebar.dpo')}</Typography>,
      icon: <AccountTieIcon />,
      accordion: [
        {
          title: t('layouts.sidebar.users'),
          href: renderUrl('/cli/dpo/users'),
          otherRefs: ['/cli/dpo/user', '/cli/dpo/user/:id'],
          icon: <PeopleIcon />,
        },
        {
          title: t('layouts.sidebar.exclusions'),
          href: renderUrl('/cli/dpo-exclusions'),
          otherRefs: ['/cli/dpo-exclusion'],
          icon: <PersonRemove />,
        },
      ],
    },
  ];

  const returnTemplate = () => administrator;
  const returnDPO = () => dpo;

  const pages = isDPO ? returnDPO() : returnTemplate();

  return (
    <Drawer anchor="left" onClose={onClose} open={open} variant={variant} PaperProps={{ elevation: 4 }}>
      <Box
        sx={(theme) => ({
          position: 'relative',
          height: 'calc(110vh - 40px)',
          overflow: 'auto',
          width: '280px',
          zIndex: 4,
          overflowScrolling: 'touch',
          backgroundColor: theme.palette.sidebar.backgroundColor,
          color: theme.palette.sidebar.color,
        })}
      >
        <Hidden smUp>
          <Divider
            sx={(theme) => ({
              margin: theme.spacing(2, 0),
            })}
          />
        </Hidden>
        <SidebarNav pages={pages} onClick={onClick} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
