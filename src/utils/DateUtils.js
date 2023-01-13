import { set } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export default class DateUtils {
    static getCurrentDateWithoutTime = () => {
      const date = new Date();
      return set(date, {
        hours: 0, minutes: 0, seconds: 0, milliseconds: 0,
      });
    };

    static getDateWithCurrentTimeZone = (date) => utcToZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone)
}
