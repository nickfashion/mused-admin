
import moment from 'moment';

export const isNumber = (value) =>
    /^\d+$/.test(value);


export const dateMinusHours = (timeAgo) =>
    moment().subtract(timeAgo, 'hours').format('YYYY-MM-DD HH:mm:ss');

export const cutString = (word) => {
    const maxLength = 50;
    return word.lenght > maxLength
        ? word.substring(0, maxLength) + '...'
        : word;
}
