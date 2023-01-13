import authApi from './AuthApi';

export default class GenericService {
    static BASE_URL = '';

    static async findAll(params) {
      try {
        return await authApi.get(this.BASE_URL, { params });
      } catch (e) {
        return e.response;
      }
    }

    static async findAllList() {
      try {
        return await authApi.get(`${this.BASE_URL}/list`);
      } catch (e) {
        return e.response;
      }
    }

    static async findAllListById(ids) {
      try {
        return await authApi.get(`${this.BASE_URL}/list/ids?${ids.map((id) => `ids=${id}`).join('&')}`);
      } catch (e) {
        return e.response;
      }
    }

    static async filter(params) {
      try {
        return await authApi.get(`${this.BASE_URL}/filter`, { params });
      } catch (e) {
        return e.response;
      }
    }

    static async findOne(id) {
      try {
        return await authApi.get(`${this.BASE_URL}/${id}`);
      } catch (e) {
        return e.response;
      }
    }

    static async create(entity) {
      try {
        return await authApi.post(this.BASE_URL, entity);
      } catch (e) {
        return e.response;
      }
    }

    static async update(entity) {
      try {
        return await authApi.put(this.BASE_URL, entity);
      } catch (e) {
        return e.response;
      }
    }

    static async deleteOne(id) {
      try {
        return await authApi.delete(`${this.BASE_URL}/${id}`);
      } catch (e) {
        return e.response;
      }
    }

    static async deleteAll(ids) {
      try {
        return await authApi.delete(`${this.BASE_URL}?${ids.map((id) => `ids=${id}`).join('&')}`);
      } catch (e) {
        return e.response;
      }
    }

    static async validateUnique(value, urlFragment, property) {
      try {
        return await authApi.get(`${this.BASE_URL}/unique/${urlFragment}`, { params: { [property]: value } });
      } catch (e) {
        return e.response;
      }
    }

    static async validateUniqueEdition(value, urlFragment, property, edition) {
      try {
        return await authApi.get(`${this.BASE_URL}/unique/edition/${urlFragment}`, { params: { [property]: value, editionId: edition } });
      } catch (e) {
        return e.response;
      }
    }
}
