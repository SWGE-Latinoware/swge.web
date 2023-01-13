import EnumOriginal from 'enum';

export default class EnumUtils {
    static Enum = (values) => {
      const entries = values.map((v, idx) => [v, idx]);
      const e = Object.fromEntries(entries);
      return new EnumOriginal(e, { freeze: true });
    }
}
