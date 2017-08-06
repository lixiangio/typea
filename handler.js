"use strict";

/**
 * 后置数据处理函数，用于处理验证结果
 */
let Handler = {
   // 关联参数，只能共同存在或消失
   coexist(output, options) {
      let data = output.data
      for (let item of options) {
         for (let name of item) {
            if (data[name] === undefined) {
               for (let name of item) {
                  delete data[name]
               }
               break
            }
         }
      }
   },
}

module.exports = Handler