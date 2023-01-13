import GenericService from './GenericService';
import authApi from './AuthApi';

export default class CaravanTutoredEnrollmentService extends GenericService {
    static BASE_URL = '/api/caravan-tutored-enrollments';

    static async findAllByCaravan(caravanId) {
      try {
        return await authApi.get(`${this.BASE_URL}/caravan/${caravanId}`);
      } catch (e) {
        return e.response;
      }
    }
}
