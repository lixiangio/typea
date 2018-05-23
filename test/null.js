"use strict"

let Validator = require('..')


let { error, data } = Validator(
   {
      a: undefined,
      b: ["kkk", "xxx"],
      c: "是"
   },
   {
      a: {
         type: String
      },
      b: {
         type: Array,
         handle(data) {
            return data.join()
         }
      },
      c: {
         type: String,
         handle(data) {
            return data
         }
      }
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}