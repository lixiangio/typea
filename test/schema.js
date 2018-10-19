"use strict"

const test = require('jtf')
const typea = require('..')


test('常规', t => {

   let schema = typea.schema({
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

   let sample = {
      a: {
         a1: 4545,
         a2: 888,
      },
      b: false
   }

   let { error, data } = schema(sample)

   // console.log(data)

   t.deepEqual(sample, data, error);

});


test('strict', t => {

   let schema = typea.schema({
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

   let sample = {
      a: {
         a1: 4545,
         // a2: 888,
      },
      b: false
   }

   let { error, data } = schema.strict(sample)

   // console.log(data)

   t.deepEqual(sample, data, error)

});


test('loose', t => {

   let schema = typea.schema({
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

   let sample = {
      a: {
         a1: 4545,
         a2: 888,
      },
      b: false
   }

   let { error, data } = schema.loose(sample)

   // console.log(data)

   t.deepEqual(sample, data, error);

});