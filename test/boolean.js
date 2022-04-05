import test from 'jtm';
import types from 'typea';

test('boolean', t => {

   const { error, data } = types(Boolean).verify(true);

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

   const schema = types({
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