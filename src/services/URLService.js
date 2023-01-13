import GenericService from './GenericService';
import authApi from './AuthApi';

export default class URLService extends GenericService {
  static BASE_URL = '/api/url';

  static async callURL(url) {
    try {
      return await authApi.get(`${this.BASE_URL}/${url}`);
    } catch (e) {
      return e.response;
    }
  }

  static async validateFile(url, formData) {
    try {
      return await authApi.post(`${this.BASE_URL}/hash-validation/${url}`, formData, {
        // eslint-disable-next-line no-underscore-dangle
        headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` },
      });
    } catch (e) {
      return e.response;
    }
  }
}
