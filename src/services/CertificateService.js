import GenericService from './GenericService';
import authApi from './AuthApi';

export default class CertificateService extends GenericService {
  static BASE_URL = '/api/certificates';

  static async generatePDF(certId, isTutored, userId, trackId, activityId) {
    try {
      return await authApi.get(`${this.BASE_URL}/pdf/${certId}`, {
        params: { isTutored, userId, trackId, activityId },
        responseType: 'blob',
      });
    } catch (e) {
      return e.response;
    }
  }
}
