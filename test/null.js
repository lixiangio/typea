"use strict"

const test = require('jtf')
const typea = require('..')

const sample = {
   a: undefined,
   b: ["kkk", "xxx"],
   c: '',
   d: null,
}

const { error, data } = typea.strict(sample, {
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
      type: String,
      allowNull: true,
   }
})

// console.log(data);

test('null', t => {

   t.deepEqual(data, {
      a: 'xxx',
      b: ["kkk", "xxx"],
      c: '',
      d: null
   }, error);

});