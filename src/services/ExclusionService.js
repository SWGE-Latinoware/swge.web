import GenericService from './GenericService';
import authApi from './AuthApi';

export default class ExclusionService extends GenericService {
  static BASE_URL = '/api/exclusions';

  static async conclude(exclusion) {
    try {
      return await authApi.post(`${this.BASE_URL}/conclude`, exclusion);
    } catch (e) {
      return e.response;
    }
  }
}
