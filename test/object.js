"use strict"

import test from 'ava';
import Check from '..';

let json = {
   a: {
      a1: 1,
      a2: "12",
   },
   b: 2,
   s: 99,
   c(a, b) {
      return a + b
   },
}

test('null', t => {

   let { error, data } = Check(json,
      {
         // a: {
         //    a1: {
         //       type: Number,
         //       allowNull: false
         //    },
         //    a2: {
         //       type: Number,
         //       allowNull: false
         //    }
         // },
         b: {
            type: Number,
            set(data) {
               return data * 2
            }
         },
         s: {
            type: Number,
            name: "拉拉",
         },
         c: Function,
      },
      {
         test() {
            return 888
         },
         ss: 999
      }
   )

   t.truthy(data, error);

});