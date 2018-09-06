"use strict"

const test = require('jtf')
const typea = require('..')

test('boolean', t => {

   let { error, data } = typea(true, Boolean)

   // console.log(data);

   t.deepEqual(true, data, error);

});


test('inline', t => {

   let sample = {
      a: true,
      b: {
         b1: true,
         b2: false
      },
      c: [true, false, true, true]
   }

   let { error, data } = typea(sample, {
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

   // console.log(data)

   t.deepEqual(sample, data, error);

})