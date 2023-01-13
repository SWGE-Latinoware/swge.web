import GenericService from './GenericService';
import authApi from './AuthApi';

export default class RegistrationService extends GenericService {
  static BASE_URL = '/api/registrations';

  static async findOneByEditionAndUser(editionId, userId) {
    try {
      return await authApi.get(`${this.BASE_URL}/edition/${editionId}/registration/${userId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async cancelRegistration(registrationId) {
    try {
      return await authApi.delete(`${this.BASE_URL}/cancel/${registrationId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async updateUserScheduleList(registrationId, schedulesId) {
    try {
      const schedules = schedulesId.length === 0 ? 'schedulesId=' : schedulesId.map((id) => `schedulesId=${id}`).join('&');
      return await authApi.put(`${this.BASE_URL}/schedule-list/${registrationId}?${schedules}`);
    } catch (e) {
      return e.response;
    }
  }

  static async charge(registrationId, payment) {
    try {
      return await authApi.post(
        `${this.BASE_URL}/payment/${registrationId}/${payment.card !== undefined ? 'card-charge' : 'pix-charge'}`,
        payment.card !== undefined && payment
      );
    } catch (e) {
      return e.response;
    }
  }

  static async createOrder(registrationId) {
    try {
      return await authApi.get(`${this.BASE_URL}/payment/${registrationId}/paypal/create-order`);
    } catch (e) {
      return e.response;
    }
  }

  static async saveOrder(registrationId, order) {
    try {
      return await authApi.post(`${this.BASE_URL}/payment/${registrationId}/paypal/save-order`, order);
    } catch (e) {
      return e.response;
    }
  }

  static async cancelPayment(registrationId) {
    try {
      return await authApi.post(`${this.BASE_URL}/payment/${registrationId}/cancel-order`);
    } catch (e) {
      return e.response;
    }
  }

  static async getPromotion(registrationId) {
    try {
      return await authApi.get(`${this.BASE_URL}/payment/${registrationId}/promotion`);
    } catch (e) {
      return e.response;
    }
  }

  static async getReceiverPix() {
    try {
      return await authApi.get(`${this.BASE_URL}/payment/pix-info`);
    } catch (e) {
      return e.response;
    }
  }

  static async completeUserRegistration(id, exempt) {
    try {
      return await authApi.post(`${this.BASE_URL}/${id}/complete-registration`, {}, { params: { exempt } });
    } catch (e) {
      return e.response;
    }
  }
}
