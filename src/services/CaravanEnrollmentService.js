import GenericService from './GenericService';
import authApi from './AuthApi';

export default class CaravanEnrollmentService extends GenericService {
  static BASE_URL = '/api/caravan-enrollments';

  static async findAllByCaravan(caravanId) {
    try {
      return await authApi.get(`${this.BASE_URL}/caravan/${caravanId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async verifyCaravanNotPay(editionId, userId) {
    try {
      return await authApi.get(`${this.BASE_URL}/verify-enrollment/edition/${editionId}/user/${userId}`);
    } catch (e) {
      return e.response;
    }
  }
}
