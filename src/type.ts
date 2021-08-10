import common from './common.js';
import symbols from './symbol.js';

import toDate from '../validator/toDate.js';
import isMongoId from '../validator/isMongoId.js';
import isMobilePhone from '../validator/isMobilePhone.js';
import isEmail from '../validator/isEmail.js';

const types = new Map();

types.set(String, {
  ...common,
  // 数据类型验证
  type(data: string | number) {
    if (typeof data === 'string') {
      return { data: data.trim() }
    } else if (typeof data === 'number') {
      return { data: data.toString() }
    } else {
      return { error: '必须为String类型' }
    }
  },
  // 限制最小长度
  min(data: string, min: number) {
    if (data.length < min) {
      return { error: `长度不能小于${min}个字符` }
    } else {
      return { data }
    }
  },
  // 限制最大长度
  max(data: string, max) {
    if (data.length > max) {
      return { error: `长度不能大于${max}个字符` }
    } else {
      return { data }
    }
  },
  // 正则
  reg(data: string, reg: RegExp) {
    if (data.search(reg) === -1) {
      return { error: '格式错误' }
    } else {
      return { data }
    }
  },
  // 包含
  in(data: string, array: [string]) {
    const result = array.indexOf(data);
    if (result === -1) {
      return { error: `值必须为[${array}]选项其中之一` }
    } else {
      return { data }
    }
  },
})

types.set(Number, {
  ...common,
  type(data: number) {
    if (isNaN(data)) {
      return { error: '必须为Number类型' }
    } else {
      return { data: Number(data) }
    }
  },
  min(data: number, min) {
    if (data < min) {
      return { error: `不能小于${min}` }
    } else {
      return { data }
    }
  },
  max(data: number, max) {
    if (data > max) {
      return { error: `不能大于${max}` };
    } else {
      return { data }
    }
  },
  // 包含
  in(data: number, array: [number]) {
    const result = array.indexOf(data);
    if (result === -1) {
      return { error: `值必须为${array}中的一个` };
    } else {
      return { data }
    }
  }
})

types.set(Array, {
  ...common,
  type(data: []) {
    if (Array.isArray(data)) {
      return { data };
    } else {
      return { error: '必须为Array类型' };
    }
  },
  min(data: [], min: number) {
    if (data.length < min) {
      return { error: `长度不能小于${min}个字符` };
    } else {
      return { data };
    }
  },
  max(data: [], max: number) {
    if (data.length > max) {
      return { error: `长度不能大于${max}个字符` };
    } else {
      return { data };
    }
  },
})

types.set(Object, {
  ...common,
  type(data: object) {
    if (typeof data === 'object') {
      return { data };
    } else {
      return { error: '必须为Object类型' };
    }
  },
})

types.set(Boolean, {
  ...common,
  type(data: boolean) {
    if (typeof data === 'boolean') {
      return { data }
    } else {
      return { error: '必须为Boolean类型' }
    }
  },
})

types.set(Date, {
  ...common,
  type(data: Date) {
    if (toDate(data + '')) {
      return { data }
    } else {
      return { error: '必须为Date类型' }
    }
  },
})

types.set(Function, {
  ...common,
  type(data: Function) {
    if (typeof data === 'function') {
      return { data }
    } else {
      return { error: '必须为Function类型' }
    }
  },
})

types.set(symbols.mongoId, {
  ...common,
  type(data) {
    if (isMongoId(String(data))) {
      return { data }
    } else {
      return { error: '必须为MongoId' }
    }
  },
})

types.set(symbols.mobilePhone, {
  ...common,
  type(data) {
    if (isMobilePhone(String(data), 'zh-CN')) {
      return { data }
    } else {
      return { error: '必须为手机号' }
    }
  },
})

types.set(symbols.email, {
  ...common,
  type(data) {
    if (isEmail(String(data))) {
      return { data }
    } else {
      return { error: '必须为Email格式' }
    }
  },
})

// 数据类型验证方法
export default types;
