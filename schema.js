let methods = require('./methods')

class Parser {

   constructor(name, express) {
      this.name = name
      this.express = express
      return this.recursion(express, '')
   }

   /**
    * 递归解析器
    * @param {*} express 验证表达式选项
    * @param {*} key 数据索引
    */
   recursion(express, key) {

      // 选项为对象
      if (typeof express === 'object') {

         // 选项为验证表达式
         if (express.type) {

            // 空值拦截
            if (data === undefined || data === '') {

               // 默认
               if (express.default) {
                  data = express.default
               }

               // 直接赋值
               else if (express.value) {
                  data = express.value
               }

               // 允许为空
               else if (express.allowNull === false) {
                  return {
                     error: `${field}不能为空`
                  }
               }

               else {
                  return {
                     data: undefined
                  }
               }

            }

         }
         
         // 选项为数组表达式
         else if (Array.isArray(express)) {

         }

         // 选项为对象表达式
         else {

         }

      }

      // 选项为构造函数或扩展类型
      else if (methods[express]) {

      }

   }

}

module.exports = function (name, express) {

   return new Parser(name, express)

}