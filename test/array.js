"use strict"

let Validator = require('../index')


let { error, data } = Validator(
   {
      a: ['xx', 'kk'],
      b: [666, 888],
   },
   {
      a: {
         type: [String],
         allowNull: false,
      },
      b: [{ type: Number }],
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
}