"use strict";

import types = require('./type.js');
import symbols = require('./symbol.js');
import common = require('./common.js');

const ignore = [undefined, null, ''];

/**
 * 判断是否允许为空值，默认将undefined、 null、空字符串视为空值
 * 默认值在大多数场景下适用，在出现例外时，可以在指定字段上使用ignore属性，重置对默认空值的定义
 * @param {*} data 需要校验空值的数据
 */
function isNull(data: any, ignore: string[]) {

   if (ignore.includes(data)) {
      return true;
   }

}

class Parser {
   origin: any;
   express: any;
   mode: string;
   /**
    * 
    * @param {*} express 验证表达式
    * @param {String} mode 验证模式
    */
   constructor(express: any, mode: string) {

      this.express = express;
      this.mode = mode;

   }

   /**
    * 执行数据验证
    * @param {*} origin 待验证原始数据
    */
   run(origin: any) {

      this.origin = origin;

      return this.recursion(this.express, origin, '');

   }

   /**
    * 递归验证器
    * @param {*} express 验证表达式
    * @param {*} data 待验证数据
    * @param {String,Number} key 数据索引
    */
   recursion(express: any, data: any, key: any) {

      // 选项值为对象
      if (typeof express === 'object') {

         return this.object(express, data, key);

      }

      // 选项值为内置构造函数或Symbol，Symbol表示自定义类型
      else if (types.get(express)) {

         if (isNull(data, ignore)) {
            // 严格模式下，禁止空值
            if (this.mode === 'strict') {
               return { error: "值不允许为空" };
            }
            return {};
         }

         const { error, data: subData } = types.get(express).type(data);

         if (error) {
            return { error: `值${error}` }
         } else {
            return { data: subData }
         }

      }

      // 选项值为严格匹配的精确值类型
      else if (data === express) {

         return { data }

      }

      // 精确值匹配失败
      else {

         return { error: `值必须为${express}` }

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
               if (isNull(data, ignore)) return {}
            }
            return { error: `值必须为Object类型` }
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
            if (isNull(data, ignore)) return {};
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
      if (isNull(data, express.ignore || ignore)) {

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
 * @param {*} data 数据源
 * @param {Object} extend 导出数据扩展函数集合
 * @param {String} mode 验证模式（仅供内部使用）
 */
function validator(express: any, data: any, extend = {}, mode: string) {

   const parser = new Parser(express, mode);
   const result = parser.run(data);

   if (result.error) {
      return result;
   }

   // 后置数据扩展函数，基于已验证的数据构建新的数据结构
   for (const name in extend) {
      let item = extend[name];
      if (typeof item === 'function') {
         item = item.call(result.data, result.data)
      }
      result.data[name] = item;
   }

   return result;

}

/**
 * @param {*} express 验证表达式
 * @param {Object} extend 数据扩展选项
 */
function typea(express: any, extend: {}) {

   return {
      /**
       * 常规验证摸索
       */
      verify(data: any) {
         return validator(express, data, extend, undefined);
      },

      /**
       * 严格模式
       * 禁止所有空值，有值验证，无值报错
       */
      strictVerify(data: any) {
         return validator(express, data, extend, 'strict');
      },

      /**
       * 宽松模式
       * 忽略所有空值，有值验证，无值跳过，即使allowNull值为true
       */
      looseVerify(data: any) {
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

export = typea;