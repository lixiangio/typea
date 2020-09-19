"use strict"

const test = require('jmr');
const { typea } = test;

const sample = {
   a: undefined,
   b: ["kkk", "xxx"],
   c: '',
   d: null,
}

const { error, data } = typea({
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
}).strictVerify(sample);

// console.log(data);

test('null',async t => {

   t.deepEqual(data, {
      a: 'xxx',
      b: ["kkk", "xxx"],
      c: '',
      d: null
   }, error);

});