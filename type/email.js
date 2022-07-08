// @ts-ignore
import isEmail from './validator/isEmail.js';
export default {
    type(data) {
        // @ts-ignore
        if (isEmail(String(data))) {
            return { data };
        }
        else {
            return { error: '值必须为 email 格式' };
        }
    },
};
