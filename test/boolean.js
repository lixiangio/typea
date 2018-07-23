"use strict"

import test from 'ava';
import Check from '..';

test(t => {

   let { error, data } = Check(true, Boolean)

   // console.log(data);

   t.deepEqual(true, data, error);

});


test('inline', t => {

   let sample = {
      a: true,
      b: {
         b1: true,
         b2: false
      },
      c: [true, false, true, true]
   }

   let { error, data } = Check(sample, {
      a: Boolean,
      b: {
         b1: {
            type: Boolean,
            allowNull: false
         },
         b2: {
            type: Boolean,
            allowNull: false
         },
      },
      c: [Boolean]
   })

   // console.log(data)

   t.deepEqual(sample, data, error);

})