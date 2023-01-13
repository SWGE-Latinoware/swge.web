import GenericService from './GenericService';
import authApi from './AuthApi';

export default class UserService extends GenericService {
  static BASE_URL = '/api/users';

  static async untieSocialAccount(registrationId, userId) {
    try {
      return await authApi.put(`${this.BASE_URL}/social-login/untie/${registrationId}/${userId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async updateByAdmin(entity) {
    try {
      return await authApi.put(`${this.BASE_URL}/admin`, entity);
    } catch (e) {
      return e.response;
    }
  }

  static async updateByUser(entity) {
    try {
      return await authApi.put(`${this.BASE_URL}/user`, entity);
    } catch (e) {
      return e.response;
    }
  }

  static async changeEnable(id) {
    try {
      return await authApi.put(`${this.BASE_URL}/change-enable/${id}`);
    } catch (e) {
      return e.response;
    }
  }

  static async resetPassword(email) {
    try {
      return await authApi.post(`${this.BASE_URL}/reset-password`, email, { params: { email } });
    } catch (e) {
      return e.response;
    }
  }

  static async findOneByEmail(email) {
    try {
      return await authApi.get(`${this.BASE_URL}/email`, { params: { email } });
    } catch (e) {
      return e.response;
    }
  }

  static async autoRegistration(user) {
    try {
      return await authApi.post(`${this.BASE_URL}/auto-registration`, user);
    } catch (e) {
      return e.response;
    }
  }

  static async emailConfirmation(id) {
    try {
      return await authApi.post(`${this.BASE_URL}/email-confirmation/${id}`);
    } catch (e) {
      return e.response;
    }
  }

  static async emailConfirmationEmail(email) {
    try {
      return await authApi.post(`${this.BASE_URL}/email-confirmation/email?email=${email}`);
    } catch (e) {
      return e.response;
    }
  }

  static async validateEmailConfirmation(email) {
    try {
      return await authApi.get(`${this.BASE_URL}/validate/email-confirmation`, { params: { email } });
    } catch (e) {
      return e.response;
    }
  }

  static async validateUserDisabled(email) {
    try {
      return await authApi.get(`${this.BASE_URL}/validate/user-disabled`, { params: { email } });
    } catch (e) {
      return e.response;
    }
  }

  static async cancelDelete(id) {
    try {
      return await authApi.delete(`${this.BASE_URL}/${id}/cancel-delete`);
    } catch (e) {
      return e.response;
    }
  }

  static async finalDelete(id) {
    try {
      return await authApi.delete(`${this.BASE_URL}/${id}/delete`);
    } catch (e) {
      return e.response;
    }
  }
}
