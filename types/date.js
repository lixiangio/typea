
import toDate from './validator/toDate.js';

export default {
  name: 'date', 
  type(data) {
    if (toDate(data + '')) {
      return { data }
    } else {
      return { error: '值必须为 date 类型' }
    }
  },
}