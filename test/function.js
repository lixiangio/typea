"use strict"

import test from 'ava';
import Check from '..';

test(t => {

   function func() { }

   let { error, data } = Check(func, Function)

   // console.log(data);

   t.deepEqual(func, data, error);

});


test('inline', t => {

   let sample = {
      a(x, y) {
         return [x, y]
      },
      b(a, b) {
         return a + b
      },
   }

   let { error, data } = Check(sample,
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