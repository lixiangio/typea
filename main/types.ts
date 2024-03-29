import type { TypeFn, StructFn, Return } from './common.js';
import { Type, Struct, TypeBind } from './createType.js';

export const string = Type("string", {
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
      return { error: `值长度不能小于 "${min}" 个字符` }
    } else {
      return { data }
    }
  },
  // 限制最大长度
  max(data: string, max: number): Return {
    if (data.length > max) {
      return { error: `值长度不能大于 "${max}" 个字符` }
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
});

TypeBind(String, string);

export const number = Type("number", {
  type(data: number): Return {
    if (typeof data === 'number') {
      return { data };
    } else {
      return { error: '值必须为 number 类型' };
    }
  },
  min(data: number, min: number): Return {
    if (data < min) {
      return { error: `值不能小于 "${min}"` }
    } else {
      return { data }
    }
  },
  max(data: number, max: number): Return {
    if (data > max) {
      return { error: `值不能大于 "${max}"` };
    } else {
      return { data }
    }
  },
  // 匹配多个可选值中的一个
  in(data: number, array: [number]): Return {
    const result = array.indexOf(data);
    if (result === -1) {
      return { error: `值必须为 "${array}" 中的一个` };
    } else {
      return { data }
    }
  }
});

TypeBind(Number, number);

export const boolean = Type("boolean", {
  type(data: boolean): Return {
    if (typeof data === 'boolean') {
      return { data }
    } else {
      return { error: '值必须为 boolean 类型' }
    }
  }
});

TypeBind(Boolean, boolean);

export const symbol = Type("symbol", {
  type(data: symbol): Return {
    if (typeof data === 'symbol') {
      return { data }
    } else {
      return { error: '值必须为 symbol 类型' }
    }
  }
});

TypeBind(Symbol, symbol);

export const func = Type("func", {
  type(data: () => object): Return {
    if (typeof data === 'function') {
      return { data }
    } else {
      return { error: '值必须为 function 类型' }
    }
  }
});

TypeBind(Function, func);

export const any = Type("any", {
  type(data: any): Return { return { data } }
});


// 结构体数组
export const array = Struct("array", {
  type(data: any[]): Return {
    if (Array.isArray(data)) {
      return { data };
    } else {
      return { error: '值必须为 array 类型' };
    }
  },
  min(data: any[], min: number): Return {
    if (data.length < min) {
      return { error: `值长度不能小于 "${min}" 个字符` };
    } else {
      return { data };
    }
  },
  max(data: any[], max: number): Return {
    if (data.length > max) {
      return { error: `值长度不能大于 "${max} "个字符` };
    } else {
      return { data };
    }
  }
});

TypeBind(Array, array);

export const { toString } = Object.prototype;

// 结构体对象
export const object = Struct("object", {
  type(data: object): Return {
    if (toString.call(data) === '[object Object]') {
      return { data };
    } else {
      return { error: "值必须为 object 类型" };
    }
  }
});

TypeBind(Object, object);

/**
 * 类型或结构验证函数集合
 */
export interface Types { [name: string]: TypeFn | StructFn }

const types: Types = {
  string,
  number,
  boolean,
  symbol,
  func,
  any,
  array,
  object
}

export default types;
