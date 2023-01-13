import authApi from './AuthApi';

export default class InfoService {
  static async getVersion() {
    try {
      return await authApi.get(`/api/info/version`);
    } catch (e) {
      return e.response;
    }
  }
}
