"use strict"

import test from 'ava';
import Check from '..';

let schema = Check.schema({
   a: {
      a1: {
         type: Number,
         allowNull: false
      },
      a2: {
         type: Number,
         allowNull: false
      }
   },
   b: Boolean,
})


test(t => {

   let sample = {
      a: {
         a1: 4545,
         a2: 888,
      },
      b: false
   }

   let { error, data } = schema(sample)

   // console.log(data)

   t.deepEqual(sample, data, error);

});