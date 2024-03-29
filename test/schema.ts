import test from 'jtm';
import Schema from 'typea';

const { number, boolean } = Schema.types;

const numberAllowNull = number({ optional: true });

test('常规', t => {

   const schema = new Schema({
      a: {
         a1: numberAllowNull,
         a2: numberAllowNull
      },
      b: boolean,
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

   t.deepEqual(data, sample, error);

});


test('strict', t => {

   const schema = new Schema({
      a: {
         a1: number,
         a2: number({ optional: true })
      },
      b: Boolean,
   })

   const sample = {
      a: {
         a1: 4545,
         a2: 12,
      },
      b: true
   }

   const { data, error } = schema.verify(sample)

   // console.log(data)

   t.deepEqual(data, sample, error)

});


test('loose', t => {

   const schema = new Schema({
      a: {
         a1: number,
         a2: numberAllowNull
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

   const { error, value } = schema.verify(sample);

   // console.log(value)

   t.deepEqual(value, sample, error);

});