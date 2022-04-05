import isMongoId from './validator/isMongoId.js';

export default {
  name: 'mongoId',
  type(data) {
    if (isMongoId(String(data))) {
      return { data }
    } else {
      return { error: '必须为MongoId' }
    }
  },
}