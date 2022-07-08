// @ts-ignore
import toDate from './validator/toDate.js';
export default {
    type(data) {
        if (toDate(data + '')) {
            return { data };
        }
        else {
            return { error: '值必须为 date 类型' };
        }
    },
};
