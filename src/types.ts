import addType from './addType.js';

interface Return { data?: any, error?: string }

addType('string', {
  // 验证 string 类型
  type(data: string): Return {
    if (typeof data === 'string') {
      return { data };
    } else {
      return { error: "值必须为 string 类型" };
    }
  },
  // 限制最小长度
  min(data: string, min: number): Return {
    if (data.length < min) {
      return { error: `值长度不能小于${min}个字符` }
    } else {
      return { data }
    }
  },
  // 限制最大长度
  max(data: string, max: number): Return {
    if (data.length > max) {
      return { error: `值长度不能大于"${max}"个字符` }
    } else {
      return { data }
    }
  },
  // 正则
  reg(data: string, reg: RegExp): Return {
    if (data.search(reg) === -1) {
      return { error: '正则表达式格式错误' }
    } else {
      return { data }
    }
  },
  // 包含
  in(data: string, array: [string]): Return {
    const result = array.indexOf(data);
    if (result === -1) {
      return { error: `值必须为 [${array}] 选项其中之一` }
    } else {
      return { data }
    }
  }
}, String);


addType('number', {
  type(data: number): Return {
    if (typeof data === 'number') {
      return { data };
    } else {
      return { error: '值必须为 number 类型' };
    }
  },
  min(data: number, min: number): Return {
    if (data < min) {
      return { error: `值不能小于"${min}"` }
    } else {
      return { data }
    }
  },
  max(data: number, max: number): Return {
    if (data > max) {
      return { error: `值不能大于"${max}"` };
    } else {
      return { data }
    }
  },
  // 包含
  in(data: number, array: [number]): Return {
    const result = array.indexOf(data);
    if (result === -1) {
      return { error: `值必须为"${array}"中的一个` };
    } else {
      return { data }
    }
  }
}, Number);

addType('boolean', {
  type(data: boolean): Return {
    if (typeof data === 'boolean') {
      return { data }
    } else {
      return { error: '值必须为 boolean 类型' }
    }
  }
}, Boolean);

addType('symbol', {
  type(data: symbol): Return {
    if (typeof data === 'symbol') {
      return { data }
    } else {
      return { error: '值必须为 symbol 类型' }
    }
  }
}, Symbol);

addType('array', {
  type(data: any[]): Return {
    if (Array.isArray(data)) {
      return { data };
    } else {
      return { error: '值必须为 array 类型' };
    }
  },
  min(data: any[], min: number): Return {
    if (data.length < min) {
      return { error: `值长度不能小于 ${min} 个字符` };
    } else {
      return { data };
    }
  },
  max(data: any[], max: number): Return {
    if (data.length > max) {
      return { error: `值长度不能大于 ${max} 个字符` };
    } else {
      return { data };
    }
  }
}, Array);

const { toString } = Object.prototype;

addType('object', {
  type(data: object): Return {
    if (toString.call(data) === '[object Object]') {
      return { data };
    } else {
      return { error: '值必须为 object 类型' };
    }
  }
}, Object);


addType('func', {
  type(data: () => object): Return {
    if (typeof data === 'function') {
      return { data }
    } else {
      return { error: '值必须为 function 类型' }
    }
  }
}, Function);


/////////////////////// 扩展类型 ///////////////////////

addType('any', {
  type(data: any): Return { return { data } }
});

