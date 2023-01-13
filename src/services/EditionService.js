import GenericService from './GenericService';
import authApi from './AuthApi';

export default class EditionService extends GenericService {
  static BASE_URL = '/api/editions';

  static async findAllCoordinators(id) {
    try {
      return await authApi.get(`${this.BASE_URL}/${id}/coordinators`);
    } catch (e) {
      return e.response;
    }
  }

  static async findAllSpeakers(id) {
    try {
      return await authApi.get(`${this.BASE_URL}/${id}/speakers`);
    } catch (e) {
      return e.response;
    }
  }

  static async findAllGridCoordinators(id) {
    try {
      return await authApi.get(`${this.BASE_URL}/${id}/grid-coordinators`);
    } catch (e) {
      return e.response;
    }
  }

  static async findAllCertificates(id) {
    try {
      return await authApi.get(`${this.BASE_URL}/${id}/certificates`);
    } catch (e) {
      return e.response;
    }
  }

  static async findAllTracks(id) {
    try {
      return await authApi.get(`${this.BASE_URL}/${id}/tracks`);
    } catch (e) {
      return e.response;
    }
  }

  static async findAllCaravansByCoordinator(editionId, coordinatorId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/coordinator/${coordinatorId}/caravans`);
    } catch (e) {
      return e.response;
    }
  }

  static async isCoordinator(editionId, coordinatorId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/coordinator/${coordinatorId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async isSpeaker(editionId, speakerId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/speaker/${speakerId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async isSecretary(editionId, secretaryId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/secretary/${secretaryId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async isDPO(editionId, dpoId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/dpo/${dpoId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async isGridCoordinator(editionId, gridCoordinatorId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/grid-coordinator/${gridCoordinatorId}`);
    } catch (e) {
      return e.response;
    }
  }

  static async findAllActivitiesBySpeaker(editionId, speakerId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/speaker/${speakerId}/activities`);
    } catch (e) {
      return e.response;
    }
  }

  static async findLanguageContentByEditionAndLanguage(editionId, language) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/languageContent/${language}`);
    } catch (e) {
      return e.response;
    }
  }

  static async createHomeContent(formData) {
    try {
      return await authApi.post(`${this.BASE_URL}/languageContent`, formData);
    } catch (e) {
      return e.response;
    }
  }

  static async updateHomeContent(formData) {
    try {
      return await authApi.put(`${this.BASE_URL}/languageContent`, formData);
    } catch (e) {
      return e.response;
    }
  }

  static async findAllEditionHomes(editionId) {
    try {
      return await authApi.get(`${this.BASE_URL}/${editionId}/languageContent`);
    } catch (e) {
      return e.response;
    }
  }
}
