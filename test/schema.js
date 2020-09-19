"use strict"

const test = require('jmr');
const { typea } = test;

test('常规', t => {

   const schema = typea({
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

   const sample = {
      a: {
         a1: 4545,
         a2: 888,
      },
      b: true
   }

   const { data, error } = schema.verify(sample);

   // console.log(data)

   t.deepEqual(sample, data, error);

});


test('strict', t => {

   const schema = typea({
      a: {
         a1: {
            type: Number
         },
         a2: {
            type: Number,
            allowNull: true
         }
      },
      b: Boolean,
   })

   const sample = {
      a: {
         a1: 4545,
         // a2: 888,
      },
      b: true
   }

   const { data, error } = schema.strictVerify(sample)

   // console.log(data)

   t.deepEqual(sample, data, error)

});


test('loose', t => {

   const schema = typea({
      a: {
         a1: {
            type: Number,
         },
         a2: {
            type: Number,
            allowNull: false
         }
      },
      b: Boolean,
   })

   const sample = {
      a: {
         a1: 4545,
         a2: 888,
      },
      b: true
   }

   const { error, data } = schema.looseVerify(sample)

   // console.log(data)

   t.deepEqual(sample, data, error);

});