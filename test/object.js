"use strict"

let Validator = require('../index')


let { error, data } = Validator(
   {
      a: 'xx',
      b: 2,
      c: 888,
   },
   {
      a: String,
      b: Number,
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}