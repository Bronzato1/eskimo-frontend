import * as moment from 'moment';

export class DateFormatValueConverter {
    toView(value, format, lang) {
        return moment(value).locale(lang).format(format);
    }
}
