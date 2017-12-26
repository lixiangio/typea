"use strict"

let Validator = require('../index')


Validator.use('Int', {
   type({ data }) {
      if (Number.isInteger(data)) {
         return { data }
      } else {
         return { error: '必须为Int类型' }
      }
   },
})


let { error, data } = Validator(
   {
      "name": 666.5,
   },
   {
      "name": {
         "type": 'Int',
         "name": "标书名称",
         "allowNull": false,
         "default": "默认值",
      }
   }
)


if (error) {
   console.log(error)
} else {
   console.log(data)
}