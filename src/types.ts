interface Return { data?: any, error?: string }

export interface Methods {
  [name: string]: (data: any, option?: any) => { error?: string, data?: any }
}

export interface Options {
  default?: any
  allowNull?: boolean
  ignore?: any[]
  [name: string | symbol]: any
}

export const type = Symbol('type');

const stringMethods = {
  // string 类型验证
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
}

function string(options: Options) {
  return {
    [type]: stringMethods,
    options
  };
}

string[type] = stringMethods;
String[type] = stringMethods;

const numberMethods = {
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
}

function number(options: Options) {
  return {
    [type]: numberMethods,
    options
  };
}

number[type] = numberMethods;
Number[type] = numberMethods;


const booleanMethods = {
  type(data: boolean): Return {
    if (typeof data === 'boolean') {
      return { data }
    } else {
      return { error: '值必须为 boolean 类型' }
    }
  }
}

function boolean(options: Options) {
  return {
    [type]: booleanMethods,
    options
  };
}

boolean[type] = booleanMethods;
Boolean[type] = booleanMethods;


const arrayMethods = {
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
}

function array(options: Options) {
  return {
    [type]: arrayMethods,
    options
  };
}

array[type] = arrayMethods;
Array[type] = arrayMethods;


const objectMethods = {
  type(data: object): Return {
    if (typeof data === 'object') {
      return { data };
    } else {
      return { error: '值必须为 object 类型' };
    }
  }
}

function object(options: Options) {
  return {
    [type]: objectMethods,
    options
  };
}

object[type] = objectMethods;
Object[type] = objectMethods;


const symbolMethods = {
  type(data: symbol): Return {
    if (typeof data === 'symbol') {
      return { data }
    } else {
      return { error: '值必须为 symbol 类型' }
    }
  }
}

function symbol(options: Options) {
  return { [type]: symbolMethods, options };
}

symbol[type] = symbolMethods;
Symbol[type] = symbolMethods;


const functionMethods = {
  type(data: () => object): Return {
    if (typeof data === 'function') {
      return { data }
    } else {
      return { error: '值必须为 function 类型' }
    }
  }
}

Function[type] = functionMethods;



/////////////////////// 扩展类型 ///////////////////////


const anyMethods = {
  type(data: any): Return { return { data } }
}

function any(options: Options) {
  return { [type]: anyMethods, options };
}

any[type] = anyMethods;


const unionMethods = {
  type(data): Return {
    return { data }
  }
}

/**
 * 联合类型
 * @param options 
 */
function union(...options) {
  return { [type]: unionMethods, options };
}

union[type] = unionMethods;


//////////////////// index 类型 ///////////////////

export const symbols = {};

function optional(name: string) {
  const symbol = Symbol('optional');
  symbols[symbol] = name;
  return symbol;
}

export const stringKey = Symbol('stringKey');

export const types = {
  string,
  number,
  boolean,
  array,
  object,
  symbol,
  any,
  union,
  optional,
  stringKey
};
