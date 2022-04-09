import test from 'jtm';
import types from 'typea';

const { boolean } = types;

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

   const allowNullBoolean = boolean({ "allowNull": false });

   const schema = types({
      a: Boolean,
      b: {
         b1: allowNullBoolean,
         b2: allowNullBoolean,
      },
      c: [Boolean]
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})