import isEmail from './validator/isEmail.js';

export default {
  name: 'email',
  type(data) {
    if (isEmail(String(data))) {
      return { data }
    } else {
      return { error: '必须为Email格式' }
    }
  },
}