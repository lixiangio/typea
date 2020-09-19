import types from './type.js';
import symbols from './symbol.js';
import common from './common.js';

const { toString } = Object.prototype;


const ignore = [undefined, null, ''];

class Parser {
  origin: any;
  express: any;
  mode: string;
  /**
   * 
   * @param {*} express 验证表达式
   * @param {String} mode 验证模式
   */
  constructor(express: any, origin: any, mode: string) {

    this.express = express;
    this.origin = origin;
    this.mode = mode;

  }

  /**
   * 递归验证器
   * @param {*} express 验证表达式
   * @param {*} data 待验证数据
   * @param {String, Number} key 数据索引
   */
  recursion(express: any, data: any, key: any) {

    // 选项值为对象
    if (typeof express === 'object') {

      return this.object(express, data, key);

    }

    // 选项值为JS基础类型构造函数或symbol，symbol表示自定义类型
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

    // 选项值为严格匹配的精确值类型
    else if (data === express) {

      return { data };

    }

    // 精确值匹配失败
    else {

      return { error: `值必须为${express}` };

    }

  }

  /**
   * 对象结构
   * @param {*} express 
   * @param {object} data 
   * @param {*} key 
   */
  object(express: any, data: object, key: any) {

    // express为验证表达式
    if (express.type) {

      return this.expression(express, data, key);

    }

    // express为数组结构
    else if (Array.isArray(express)) {

      return this.array(express, data, key);

    }

    // express为对象结构
    else {

      if (typeof data !== 'object') {
        // 宽松模式下，跳过空值
        if (this.mode === 'loose') {
          if (ignore.includes(data)) return {};
        }
        return { error: `值必须为Object类型` };
      }

      const dataObj = {}

      for (const sKey in express) {

        const { error, data: subData } = this.recursion(express[sKey], data[sKey], sKey);

        if (error) {
          // 非根节点
          if (key) {
            return { error: `.${sKey}${error}` };
          } else {
            return { error: `${sKey}${error}` };
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
   * 数组结构
   * @param {*} express 
   * @param {*} data 
   * @param {*} key 
   */
  array(express: any[], data, key: number) {

    if (!Array.isArray(data)) {
      // 宽松模式下，跳过空值
      if (this.mode === 'loose') {
        if (ignore.includes(data)) return {};
      }
      return { error: `${key}必须为数组类型` }
    }

    let itemKey = 0;
    const dataArray = [];

    // express为单数时采用通用匹配
    if (express.length === 1) {

      const [option] = express;

      for (const itemData of data) {

        // 子集递归验证
        const { error, data: subData } = this.recursion(option, itemData, itemKey);

        if (error) {
          return { "error": `[${itemKey}]${error}` };
        } else if (subData !== undefined) {
          dataArray.push(subData);
        }

        itemKey++;

      }

    }

    // express为复数时采用精确匹配
    else {

      for (const option of express) {

        const itemData = data[itemKey];

        // 子集递归验证
        const { error, data: subData } = this.recursion(option, itemData, itemKey);

        if (error) {
          return { "error": `[${itemKey}]${error}` };
        } else if (subData !== undefined) {
          dataArray.push(subData);
        }

        itemKey++;

      }

    }

    return { data: dataArray };

  }

  /**
   * 验证表达式
   * @param {*} express 
   * @param {*} data 
   * @param {*} key 
   */
  expression(express: any, data: object, key: string) {

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

    const type: object = types.get(express.type);

    // type为内置数据类型
    if (type) {

      for (const name in express) {
        const method = type[name];
        if (method) {
          const option = express[name];
          const { error, data: subData } = method(data, option, this.origin)
          if (error) {
            return { error: `${error}` }
          }
          data = subData
        }
      }

      return { data }

    }

    // 不支持的数据类型
    else {
      return { error: `${key}参数配置错误，不支持${express.type}类型` }
    }

  }

}

/**
 * 验证器
 * @param {*} express 验证表达式
 * @param {*} origin 数据源
 * @param {object} extend 导出数据扩展函数集合
 * @param {string} mode 验证模式（仅供内部使用）
 */
function validator(express: any, origin: any, extend: object, mode: string) {

  const parser = new Parser(express, origin, mode);

  if (toString.call(express) === '[object Object]') {

    const root = {};

    for (const name in express) {

      const { error, data } = parser.recursion(express[name], origin[name], name);

      if (error) {
        return { error: `${name}${error}` };
      }

      else if (data !== undefined) {
        root[name] = data;
      }

    }

    if (extend) {

      // 后置数据扩展函数，基于已验证的数据构建新的数据结构
      for (const name in extend) {
        let value = extend[name];
        if (typeof value === 'function') {
          value = value(root);
        }
        root[name] = value;
      }

    }

    return { data: root };

  } else {

    return parser.recursion(express, origin, '');

  }

}

/**
 * @param {*} express 验证表达式
 */
function typea(express: any) {

  return {
    /**
     * 常规模式，allowNull值为true时强制验证
     * @param {object} extend 数据扩展选项
     */
    verify(data: any, extend: object) {
      return validator(express, data, extend, undefined);
    },

    /**
     * 严格模式
     * 禁止所有空值，有值验证，无值报错
     * @param {object} extend 数据扩展选项
     */
    strictVerify(data: any, extend: object) {
      return validator(express, data, extend, 'strict');
    },

    /**
     * 宽松模式
     * 忽略所有空值，有值验证，无值跳过，忽略allowNull属性
     * @param {object} extend 数据扩展选项
     */
    looseVerify(data: any, extend: object) {
      return validator(express, data, extend, 'loose');
    }
  };

}

typea.types = symbols;


/**
 * 自定义数据类型扩展方法
 * @param {Function, Symbol, String} type 数据类型
 * @param {Object} options 扩展选项
 * @param {Object.Function} options 扩展方法
 */
typea.use = function (type: string | number, options = {}) {

  if (!type) return;

  const value = types.get(type);

  // 通过Symbol定位，扩展已有数据类型
  if (value) {

    Object.assign(value, options);

  }

  // 通过String定位，扩展已有数据类型或创建新类型
  else if (typeof type === 'string') {

    // 扩展已有Symbol类型
    if (symbols[type]) {

      const symbol = symbols[type];
      const value = types.get(symbol);
      Object.assign(value, options);

    }

    // 创建新类型
    else {

      Object.assign(options, common);
      const symbol = Symbol(type);
      symbols[type] = symbol;
      types.set(symbol, options);

    }

  }

}

export default typea;