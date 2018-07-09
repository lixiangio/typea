"use strict"

import test from 'ava';
import Check from '..';

test('null', t => {

   let { error, data } = Check(
      {
         a: undefined,
         b: ["kkk", "xxx"],
         c: "是"
      },
      {
         a: {
            type: String
         },
         b: {
            type: Array,
            handle(data) {
               return data.join()
            }
         },
         c: {
            type: String,
            handle(data) {
               return data
            }
         }
      }
   )

   t.truthy(data, error);

});