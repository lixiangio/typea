"use strict"

const test = require('jtf')
const typea = require('..')

test('function', t => {

   function func() { }

   const { error, data } = typea(func, Function)

   // console.log(data);

   t.deepEqual(func, data, error);

});


test('inline', t => {

   const sample = {
      a(x, y) {
         return [x, y]
      },
      b(a, b) {
         return a + b
      },
   }

   const { error, data } = typea(sample,
      {
         a: Function,
         b: {
            type: Function,
            set(func) {
               return func(1, 1)
            }
         },
      }
   )

   // console.log(data);

   t.deepEqual({
      a: sample.a,
      b: 2,
   }, data, error, data);

});