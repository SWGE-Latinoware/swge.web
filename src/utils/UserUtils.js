export default class UserUtils {
    static isFakeTempEmail = (email) => {
      if (email == null) return false;
      return email.startsWith('*___TEMP_') && email.endsWith('_TEMP___*');
    };

    static isFakeTempName = (name) => UserUtils.isFakeTempEmail(name);
}
