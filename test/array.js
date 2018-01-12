"use strict"

let Validator = require('..')


let { error, data } = Validator(
   {
      a: ['xx', 'kk'],
      b: [666, 1, 88],
   },
   {
      b: [{ "type": Number, "allowNull": false }, { "allowNull": false }],
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}