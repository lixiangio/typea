"use strict"

import test from 'ava';
import Check from '..';

test('function', t => {

   let { error, data } = Check(
      {
         a: {
            a1: 1,
            a2: "12",
         },
         b: "666",
      },
      {
         a: {
            a1: Number,
            a2: Number,
         },
         b: Number,
      }
   )

   t.truthy(data, error);

});