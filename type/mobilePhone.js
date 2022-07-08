// @ts-ignore
import isMobilePhone from './validator/isMobilePhone.js';
export default {
    type(data) {
        // @ts-ignore
        if (isMobilePhone(String(data), 'zh-CN')) {
            return { data };
        }
        else {
            return { error: '值必须为手机号' };
        }
    }
};
