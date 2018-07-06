"use strict"

let Validator = require('..')

let obj = {
   a: {
      a1: 1,
      a2: "12",
   },
   b: 2,
   s: 99,
   c(a, b) {
      return a + b
   },
}

let { error, data } = Validator(obj,
   {
      // a: {
      //    a1: {
      //       type: Number,
      //       allowNull: false
      //    },
      //    a2: {
      //       type: Number,
      //       allowNull: false
      //    }
      // },
      b: {
         type: Number,
         set(data) {
            return data * 2
         }
      },
      s: {
         type: Number,
         name: "拉拉",
      },
      c: Function,
   },
   {
      test() {
         return 888
      },
      ss: 999
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}