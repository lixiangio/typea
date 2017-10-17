"use strict"

let Validator = require('../index')


let { error, data } = Validator(
   {
      a: {
         a1: 1,
         a2: "12",
      },
      b: 2,
      c: 888,
   },
   {
      a: {
         a1: {
            type: Number,
            allowNull: false
         },
         a2: {
            type: Number,
            allowNull: false
         }
      },
      b: Number,
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}