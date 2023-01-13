import GenericService from './GenericService';
import authApi from './AuthApi';

export default class FileService extends GenericService {
  static BASE_URL = '/api/files';

  static async findOne(id) {
    try {
      return await authApi.get(`${this.BASE_URL}/${id}`, { responseType: 'blob' });
    } catch (e) {
      return e.response;
    }
  }

  static async create(formData) {
    try {
      return await authApi.post(this.BASE_URL, formData, {
        // eslint-disable-next-line no-underscore-dangle
        headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` },
      });
    } catch (e) {
      return e.response;
    }
  }

  static async update(formData) {
    try {
      return await authApi.put(this.BASE_URL, formData, {
        // eslint-disable-next-line no-underscore-dangle
        headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` },
      });
    } catch (e) {
      return e.response;
    }
  }

  static async getTerm(termName) {
    try {
      return await authApi.get(`${this.BASE_URL}/terms/${termName}`);
    } catch (e) {
      return e.response;
    }
  }
}
