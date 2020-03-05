"use strict"

const test = require('jtf')
const typea = require('..').default

test('boolean', t => {

   const { error, data } = typea(Boolean).verify(true);

   // console.log(data);

   t.deepEqual(true, data, error);

});


test('inline', t => {

   const sample = {
      a: true,
      b: {
         b1: true,
         b2: false
      },
      c: [true, true, false, true]
   }

   const schema = typea({
      a: Boolean,
      b: {
         b1: {
            type: Boolean,
            allowNull: false
         },
         b2: {
            type: Boolean,
            allowNull: false
         },
      },
      c: [Boolean]
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})