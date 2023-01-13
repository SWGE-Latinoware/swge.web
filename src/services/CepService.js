import authApi from './AuthApi';

export default class CepService {
  static async getCEP(cep) {
    try {
      return await authApi.get(`/api/location/cep/${cep}`);
    } catch (e) {
      return e.response;
    }
  }

  static async getUFs() {
    try {
      return await authApi.get('/api/location/ufs');
    } catch (e) {
      return e.response;
    }
  }

  static async getCities() {
    try {
      return await authApi.get('/api/location/cities');
    } catch (e) {
      return e.response;
    }
  }
}
