"use strict"

const test = require('jtf')
const typea = require('..')


test('常规', t => {

   const schema = typea.schema({
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
      b: false
   }

   const { error, data } = schema(sample)

   // console.log(data)

   t.deepEqual(sample, data, error);

});


test('strict', t => {

   const schema = typea.schema({
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
      b: false
   }

   const { error, data } = schema.strict(sample)

   // console.log(data)

   t.deepEqual(sample, data, error)

});


test('loose', t => {

   const schema = typea.schema({
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
      b: false
   }

   const { error, data } = schema.loose(sample)

   // console.log(data)

   t.deepEqual(sample, data, error);

});