"use strict";

/**
 * 通用验证方法
 */

export default {
   // 参数自定义转换方法
   set(data, func, origin) {
      return { data: func.call(origin, data) };
   },
   // 直接赋值（覆盖原来的值）
   value(undefined, data) {
      return { data };
   },
   // 与
   and(data, option, origin) {
      // option为函数时先执行函数，将函数转为数组表达式
      if (option instanceof Function) {
         option = option.call(origin, data)
      }
      // 数组表达式
      if (option instanceof Array) {
         for (const name of option) {
            if (origin[name] === undefined || origin[name] === '') {
               return { error: `必须与${name}参数同时存在` }
            }
         }
      }
      return { data }
   },
   // 或
   or(data, option, origin) {
      // 如果option为函数，应先执行函数，将函数转为数组
      if (option instanceof Function) {
         option = option.call(origin, data);
      }
      if (option instanceof Array) {
         let status = true;
         for (const name of option) {
            if (origin[name] !== undefined && origin[name] !== '') {
               status = false;
            }
         }
         if (status) {
            return { error: `必须至少与[${option}]参数中的一个同时存在` };
         }
      }
      return { data };
   },
}