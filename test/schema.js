import test from 'jtm';
import types from 'typea';

const { number, boolean } = types;

const numberAllowNull = number({ allowNull: false });

test('常规', t => {

   const schema = types({
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

   t.deepEqual(sample, data, error);

});


test('strict', t => {

   const schema = types({
      a: {
         a1: number,
         a2: number({ allowNull: true })
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

   const { data, error } = schema.verify(sample, 'strict')

   // console.log(data)

   t.deepEqual(sample, data, error)

});


test('loose', t => {

   const schema = types({
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

   const { error, data } = schema.verify(sample, 'loose')

   // console.log(data)

   t.deepEqual(sample, data, error);

});