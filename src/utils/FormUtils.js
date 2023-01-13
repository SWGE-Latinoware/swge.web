import _ from 'lodash';

export default class FormUtils {
  static CEPMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  static cellPhoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  static phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  static RGMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/];

  static hourMask = [/\d/, /\d/, ':', /\d/, /\d/];

  static removeEmptyFields = (data) => {
    const newData = {};
    _.forOwn(data, (value, key) => {
      if (!(key === '' || value == null)) {
        newData[key] = value;
      }
    });
    return newData;
  };
}
