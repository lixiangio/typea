import test from 'jtm';
import { Schema, boolean } from 'typea';

test('boolean', t => {

   const { error, value } = new Schema(Boolean).verify(true);

   // console.log(value);

   t.deepEqual(true, value, error);

});

test('inline', t => {

   const schema = new Schema({
      a: Boolean,
      b: {
         b1: boolean,
         b2: boolean,
      },
      c: [...boolean]
   })

   const sample = {
      a: true,
      b: {
         b1: true,
         b2: false
      },
      c: [true, true, false, true]
   }

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});