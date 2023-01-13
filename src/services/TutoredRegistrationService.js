import GenericService from './GenericService';
import authApi from './AuthApi';

export default class TutoredRegistrationService extends GenericService {
  static BASE_URL = '/api/tutored-registrations';

  static async findOneByEditionAndTutoredUser(editionId, userId) {
    try {
      return await authApi.get(`${this.BASE_URL}/edition/${editionId}/registration/${userId}`);
    } catch (e) {
      return e.response;
    }
  }
}
