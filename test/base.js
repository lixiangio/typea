import test from 'jtm';
import types from 'typea';

test('String in Array', t => {

   const sample = ['a', 'b', 'c']

   const { error, data } = types([String]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('[number]', t => {

   const sample = [1, 2, 3]

   const { error, data } = types([Number]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('{number}', t => {

   const sample = {
      x: 1,
      y: 2
   }

   const schema = types({
      x: Number,
      y: Number
   })
   
   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})


test('{string}', t => {

   const sample = {
      x: "hello",
      y: "word"
   }

   const schema = types({
      x: String,
      y: String
   })
   
   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})