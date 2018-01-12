"use strict"

let Validator = require('..')

let schema = Validator.schema('demo', {
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
})

let data1 = {
   a: {
      a1: "jj",
      a2: "12",
   },
   b: 2,
   c: 888,
}

let data2 = {
   a: {
      a1: 666,
      a2: "12",
   },
   b: 2,
   c: 888,
}

// let { error, data } = schema(data1)

let result1 = Validator.demo(data1)

if (result1.error) {
   console.log(result1.error)
} else {
   console.log(result1.data)
}

let result2 = Validator.demo(data2)

if (result2.error) {
   console.log(result2.error)
} else {
   console.log(result2.data)
}