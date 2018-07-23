"use strict"

import test from 'ava';
import Check from '..';

test(t => {

   let { error, data } = Check(true, Boolean)

   // console.log(data);

   t.deepEqual(data, true, error);

});


test('inline', t => {

   let sample = {
      a: true,
      b: false,
      c: [true, false, true, true]
   }

   let { error, data } = Check(sample, {
      a: Boolean,
      b: {
         type: Boolean,
         allowNull: false
      },
      c: [Boolean]
   })

   // console.log(data)

   t.deepEqual(sample, data, error);

});