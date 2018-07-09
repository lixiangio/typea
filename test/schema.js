"use strict"

import test from 'ava';
import Check from '..';

let schema = Check.schema('demo',
   {
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
      b: Number,
   },
   {
      find({ a, b }) {
         return {
            c: a,
            d: b,
         }
      }
   }
)


test('schema 1', t => {

   let { error, data } = Check.demo({
      a: {
         a1: 999,
         a2: "12",
      },
      b: 2,
      c: 888,
   })

   t.truthy(data, error);

});

test('schema 2', t => {

   let { error, data } = Check.demo({
      a: {
         a1: 666,
         a2: "12",
      },
      b: 344,
      c: 333,
   })

   t.truthy(data, error);

});