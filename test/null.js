"use strict"

const test = require('jtf')
const typea = require('..')

let sample = {
   a: undefined,
   b: ["kkk", "xxx"],
   c: '',
   d: null,
}

let { error, data } = typea(sample,
   {
      a: {
         type: String,
         allowNull: false,
         default: 'xxx',
      },
      b: [String],
      c: {
         type: String,
         allowNull: true,
      },
      d: {
         type: Number,
         allowNull: true,
      }
   }
)

console.log(data);

test('null', t => {

   t.deepEqual(data, {
      a: 'xxx',
      b: ["kkk", "xxx"],
      c: '',
      d: null
   }, error);

});