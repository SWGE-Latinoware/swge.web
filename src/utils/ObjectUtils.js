import hash from 'object-hash';

export default class ObjectUtils {
    static getHash = (data) => {
      if (data == null) return null;
      return hash(data);
    };
}
