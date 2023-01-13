import EnumUtils from '../utils/EnumUtils';

const FeedbackStatus = EnumUtils.Enum([
  'OPEN',
  'ON_GOING',
  'CLOSED',
]);

export default FeedbackStatus;
