"use strict"

let Validator = require('../index')


let { error, data } = Validator(
   {
      a: {
         a1: 1,
         a2: "12",
      },
      b: "xx",
   },
   {
      a: {
         a1: Number,
         a2: Number,
      },
      b: Number,
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}