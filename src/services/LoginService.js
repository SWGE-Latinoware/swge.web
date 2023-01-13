import authApi from './AuthApi';

export default class LoginService {
  static async login(params) {
    try {
      return await authApi.post('/api/login', params);
    } catch (e) {
      return e.response;
    }
  }
}
