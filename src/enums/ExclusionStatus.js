import EnumUtils from '../utils/EnumUtils';

const ExclusionStatus = EnumUtils.Enum(['NOT_ANALYZED', 'APPROVED', 'DENIED', 'CANCELED']);

export default ExclusionStatus;
