"use strict"

let Validator = require('..')


let { error, data } = Validator(
   {
      a: undefined,
      b: ["kkk", "xxx"],
   },
   {
      a: {
         type: String,
         ignore: [null, undefined]
      },
      b: {
         type: Array,
         ignore: [null, undefined, ''],
         handle(data) {
            return data.join()
         }
      }
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}