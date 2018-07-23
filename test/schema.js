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


test('通过对象访问 A', t => {

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

test('通过对象访问 B', t => {

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


test('通过导出变量访问', t => {

   let { error, data } = schema({
      a: {
         a1: 4545,
         a2: "888",
      },
      b: 990,
      c: 1212,
   })

   t.truthy(data, error);

});