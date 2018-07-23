"use strict"

import test from 'ava';
import Check from '..';

let sample = {
   a: undefined,
   b: ["kkk", "xxx"],
   c: "666"
}

let { error, data } = Check(sample,
   {
      a: {
         type: String,
         allowNull: false,
         default: 'xxx',
      },
      b: [String],
      c: {
         type: String
      }
   }
)

// console.log(data);

test(t => {

   t.deepEqual({
      a: 'xxx',
      b: ["kkk", "xxx"],
      c: "666"
   }, data, error);

});