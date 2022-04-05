import test from 'jtm';
import types from 'typea';

test('常规', t => {

   const schema = types({
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

   const schema = types({
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

   const schema = types({
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