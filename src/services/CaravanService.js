import GenericService from './GenericService';
import authApi from './AuthApi';

export default class CaravanService extends GenericService {
    static BASE_URL = '/api/caravans';

    static async findAllByEdition(editionId) {
      try {
        return await authApi.get(`${this.BASE_URL}/edition/${editionId}`);
      } catch (e) {
        return e.response;
      }
    }

    static async findAllByEditionAndUser(editionId, userId) {
      try {
        return await authApi.get(`${this.BASE_URL}/edition/${editionId}/enrollments/${userId}`);
      } catch (e) {
        return e.response;
      }
    }

    static async userEnrollment(caravanId, userId) {
      try {
        return await authApi.post(`${this.BASE_URL}/enroll/${caravanId}/${userId}`);
      } catch (e) {
        return e.response;
      }
    }

    static async tutoredUserEnrollment(caravanId, user) {
      try {
        return await authApi.post(`${this.BASE_URL}/enroll/tutored/${caravanId}`, user);
      } catch (e) {
        return e.response;
      }
    }

    static async userEnrollmentList(caravanId, userIds) {
      try {
        return await authApi.post(`${this.BASE_URL}/enroll/list/${caravanId}`, userIds);
      } catch (e) {
        return e.response;
      }
    }

    static async tutoredUserEnrollmentList(caravanId, userIds) {
      try {
        return await authApi.post(`${this.BASE_URL}/enroll/tutored/list/${caravanId}`, userIds);
      } catch (e) {
        return e.response;
      }
    }
}
