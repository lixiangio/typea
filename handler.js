"use strict";

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
   // 分组导出参数至指定对象
   group(output, options) {
      let data = output.data
      for (let name in options) {
         // 对象不存在时自动创建
         if (!output[name]) {
            output[name] = {}
         }
         let groupArray = options[name]
         for (let path of groupArray) {
            if (data[path] !== undefined) {
               output[name][path] = data[path]
            }
         }
      }
   }
}

module.exports = Handler