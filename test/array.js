"use strict"

import test from 'ava';
import Check from '..';

let json = {
   a: ['xx', 'kk'],
   b: [666, 999, 88],
}

test('example', t => {

   let { error, data } = Check(json, {
      b: [{
         "type": Number,
         "allowNull": false
      }, {
         "allowNull": false
      }]
   })


   t.truthy(data, error);

});