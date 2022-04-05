import types, { base } from './types.js';

interface ExpressType {
  type?: Function | symbol
  allowNull?: boolean
  default?: any
  ignore?: any[]
  [name: string]: any
}

interface Object { [name: string]: any }

const { toString } = Object.prototype;

const ignore = [undefined, null, ''];

class Parser {
  mode: string;
  express: any;
  /**
   * @param express 验证表达式
   * @param mode 验证模式
   */
  constructor(express: any, mode: string) {

    this.express = express;
    this.mode = mode;

  }

  /**
   * 递归验证器
   * @param key 数据索引
   * @param express 验证表达式
   * @param data 待验证数据
   */
  recursion(key: string | number, express: any, data: any) {

    // 选项值为对象或数组
    if (typeof express === 'object') {

      return this.object(key, express, data);

    }

    // 选项值为 JS 基础数据类型构造函数，或自定义 symbol 类型
    else if (types.get(express)) {

      if (ignore.includes(data)) {
        // 严格模式下，禁止空值
        if (this.mode === 'strict') {
          return { error: "值不允许为空" };
        }
        return {};
      }

      const { error, data: subData } = types.get(express).type(data);

      if (error) {
        return { error: `值${error}` };
      } else {
        return { data: subData };
      }

    }

    else if (typeof express === 'function') {

      if (typeof data === 'function') {
        express(data, (value: any) => data = value);
        return { data };
      } else {
        return { error: `值必须为 function 类型` };
      }

    }

    // 选项值为精确赋值匹配
    else if (data === express) {

      return { data };

    }

    // 精确值匹配失败
    else {

      return { error: `值必须为 ${express}` };

    }

  }

  /**
   * 对象类型节点
   * @param key 属性名
   * @param express 验证表达式
   * @param data 待验证数据
   */
  object(key: string | number, express: Object, data: any) {

    // express 为验证表达式
    if (express.type) {

      return this.expression(key, express, data);

    }

    // express 为数组结构
    else if (Array.isArray(express)) {

      return this.array(key, express, data);

    }

    // express为对象结构
    else {

      if (typeof data !== 'object') {
        // 宽松模式下，跳过空值
        if (this.mode === 'loose') {
          if (ignore.includes(data)) return {};
        }
        return { error: `值必须为 Object 类型` };
      }

      const dataObj = {}

      for (const sKey in express) {

        const { error, data: subData } = this.recursion(sKey, express[sKey], data[sKey]);

        if (error) {
          // 非根节点
          if (key) {
            return { error: `.${sKey} ${error}` };
          } else {
            return { error: `${sKey} ${error}` };
          }
        }

        else if (subData !== undefined) {
          dataObj[sKey] = subData;
        }

      }

      return { data: dataObj };

    }

  }

  /**
   * 数组类型节点
   * @param key 
   * @param express 
   * @param data 
   */
  array(key: number | string, express: any[], data: any[]) {

    if (!Array.isArray(data)) {
      // 宽松模式下，跳过空值
      if (this.mode === 'loose') {
        if (ignore.includes(data)) return {};
      }
      return { error: `${key}必须为 Array 类型` }
    }

    let itemKey = 0;
    const dataArray = [];

    // 只有一个子表达式，可以表示一对一的精确匹配，也可以表示一对多泛匹配
    // 当有多个子表达式时，每个子表达示的占位与值之间一对一精确匹配，概念等同于 Typescript 中的元组类型
    if (express.length === 1) {

      const [options] = express;

      for (const itemData of data) {

        // 子集递归验证
        const { error, data: subData } = this.recursion(itemKey, options, itemData);

        if (error) {
          return { "error": `[${itemKey}] ${error}` };
        } else if (subData !== undefined) {
          dataArray.push(subData);
        }

        itemKey++;

      }

    }

    // express 为复数时采用精确匹配
    else {

      for (const options of express) {

        const itemData = data[itemKey];

        // 子集递归验证
        const { error, data: subData } = this.recursion(itemKey, options, itemData);

        if (error) {
          return { "error": `[${itemKey}] ${error}` };
        } else if (subData !== undefined) {
          dataArray.push(subData);
        }

        itemKey++;

      }

    }

    return { data: dataArray };

  }

  /**
   * 验证表达式节点
   * @param key 
   * @param express 
   * @param data 
   */
  expression(key: string | number, express: ExpressType, data: object) {

    // 空值处理
    if ((express.ignore || ignore).includes(data)) {

      // 默认值
      if (express.default) {
        data = express.default
      }

      // 禁止空值
      else if (express.allowNull === false) {
        return { error: `值不允许为空` };
      }

      // 允许空值
      else if (express.allowNull === true) {
        return { data };
      }

      // 严格模式下，禁止空值
      else if (this.mode === 'strict') {
        return { error: `值不允许为空` };
      }

      else {
        return { data };
      }

    }

    const methods: object = types.get(express.type);

    if (methods) {

      for (const name in express) {
        const method = methods[name]; // 每个有效的 express.name 都有对应的 methods[name]() 处理函数
        if (method) {
          const options = express[name];
          const { error, data: subData } = method(data, options);
          if (error) {
            return { error: `${error}` }
          }
          data = subData;
        }
      }

      return { data };

    }

    // 不支持的数据类型
    else {

      return { error: `${key} 定义的 "${String(express.type)}" 类型无效` };

    }

  }

}

/**
 * 验证器
 * @param mode 验证模式
 * @param schema 验证表达式
 * @param originData 原始数据
 * @param extend 已验证数据的后置扩展函数集合
 */
function validator(mode: string, schema: any, originData: any, extend: object) {

  const parser = new Parser(schema, mode);

  if (toString.call(schema) === '[object Object]') {

    const data = {};

    for (const name in schema) {

      const result = parser.recursion(name, schema[name], originData[name]);

      if (result.error) {
        return { error: `${name} ${result.error}` };
      }

      else if (result.data !== undefined) {
        data[name] = result.data;
      }

    }

    if (extend) {

      // 后置数据扩展函数，基于已验证的数据构建新的数据结构
      for (const name in extend) {
        const value = extend[name];
        if (typeof value === 'function') {
          data[name] = value(data);
        } else {
          data[name] = value;
        }
      }

    }

    return { data };

  } else {

    return parser.recursion('', schema, originData);

  }

}

/**
 * @param express 验证表达式
 */
function typea(schema: any) {

  // schema 预处理


  return {
    /**
     * 常规模式，allowNull值为 true 时强制验证
     * @param {object} extend 数据扩展选项
     */
    verify(data: any, extend: object) {
      return validator(null, schema, data, extend);
    },

    /**
     * 严格模式
     * 禁止所有空值，有值验证，无值报错
     * @param {object} extend 数据扩展选项
     */
    strictVerify(data: any, extend: object) {
      return validator('strict', schema, data, extend);
    },

    /**
     * 宽松模式
     * 忽略所有空值，有值验证，无值跳过，忽略allowNull属性
     * @param {object} extend 数据扩展选项
     */
    looseVerify(data: any, extend: object) {
      return validator('loose', schema, data, extend);
    }
  };

}


/**
 * 自定义数据类型扩展方法
 * @param type 数据类型
 * @param options 扩展选项
 * @param options 扩展方法
 */
typea.type = function (type: string, options: object): void {

  // 通过String定位，扩展已有数据类型或创建新类型
  if (typeof type !== 'string') return;

  const symbol = typea[type];

  // 扩展已有 symbol 类型
  if (symbol) {

    const methods = types.get(symbol);
    Object.assign(methods, options);

  }

  // 创建新类型
  else {

    const symbol = Symbol(type);
    typea[type] = symbol;
    types.set(symbol, {
      ...options,
      ...base,
    });

  }

}

export default typea;