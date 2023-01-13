import GenericService from './GenericService';
import authApi from './AuthApi';

export default class ActivityService extends GenericService {
  static BASE_URL = '/api/activities';

  static async findAllByEdition(editionId) {
    try {
      return await authApi.get(`${this.BASE_URL}/edition/${editionId}`);
    } catch (e) {
      return e.response;
    }
  }
}
