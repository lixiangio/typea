"use strict"

let Validator = require('../index')


let { error, data } = Validator(
   {
      a: ['xx', 'kk'],
      b: ['rr', 'ss'],
   },
   {
      a: [String],
      b: {
         type: [String]
      },
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}