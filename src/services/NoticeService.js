import GenericService from './GenericService';
import authApi from './AuthApi';

export default class NoticeService extends GenericService {
  static BASE_URL = '/api/notices';

  static async deleteNotice(id, caravanId) {
    try {
      return await authApi.delete(`${this.BASE_URL}/${id}`, { params: { caravanId } });
    } catch (e) {
      return e.response;
    }
  }
}
