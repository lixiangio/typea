import isMongoId from './validator/isMongoId.js';

export default {
  name: 'mongoId',
  type(data) {
    if (isMongoId(String(data))) {
      return { data }
    } else {
      return { error: '值必须为 mongoId 类型' }
    }
  },
}