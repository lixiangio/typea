"use strict"

const test = require('jtf');
const typea = require('..');

test('array', t => {

   const schema = typea.schema([
      {
         'state': {
            type: Boolean,
            defaultValue: false,
         }
      }
   ])

   const sample = [{ state: true }]

   const { error, data } = schema(sample)

   t.deepEqual(sample, data, error);

});

test('array', t => {

   const sample = {
      a: ['xx', 'kk'],
      b: [666, 999, 88,],
      c: [{ a: 1 }, { a: 2 }, { b: 3 }],
      d: [
         {
            d1: 666,
            d2: "888"
         },
         999,
         [
            {
               xa: 1,
               xb: [1, 2, 3],
            },
            {
               xa: 9,
               xb: [2, 4, 3],
            }
         ],
         "hello"
      ],
      e: [1, 2, 3],
   }

   const { error, data } = typea(sample, {
      a: [{ "type": String }],
      b: [{
         "type": Number,
         "allowNull": false
      }],
      c: [{ a: Number, b: Number }],
      d: [
         {
            d1: 666,
            d2: String
         },
         Number,
         [
            {
               xa: Number,
               xb: [{
                  "type": Number,
                  "allowNull": false
               }],
            }
         ],
         String
      ],
      e: Array
   })

   // console.log(data);

   t.deepEqual(sample, data, error);

});