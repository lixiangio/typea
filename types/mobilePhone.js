import isMobilePhone from './validator/isMobilePhone.js';

export default {
  name: 'mobilePhone',
  type(data) {
    if (isMobilePhone(String(data), 'zh-CN')) {
      return { data }
    } else {
      return { error: '必须为手机号' }
    }
  }
}
