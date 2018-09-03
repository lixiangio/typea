"use strict"

const test = require('jtf')
const Check = require('..')

let sample = {
   a: undefined,
   b: ["kkk", "xxx"],
   c: "666"
}

let { error, data } = Check(sample,
   {
      a: {
         type: String,
         allowNull: false,
         default: 'xxx',
      },
      b: [String],
      c: {
         type: String
      }
   }
)

// console.log(data);

test('null', t => {

   t.deepEqual({
      a: 'xxx',
      b: ["kkk", "xxx"],
      c: "666"
   }, data, error);

});