import EnumUtils from '../utils/EnumUtils';

const ActivityType = EnumUtils.Enum([
  'LECTURE',
  'MINI_COURSE',
  'WORKSHOP',
  'KEYNOTE',
  'PAPER_PRESENTATION',
  'POSTER_PRESENTATION',
  'OTHER',
]);

export default ActivityType;
