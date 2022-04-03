import test from 'jtm';

const { types } = test;

test('String in Array', t => {

   const sample = ['a', 'b', 'c']

   const { error, data } = types([String]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('[Number]', t => {

   const sample = [1, 2, 3]

   const { error, data } = types([Number]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('{Number}', t => {

   const sample = {
      x: 1,
      y: 2
   }

   const { error, data } = types({
      x: Number,
      y: Number
   }).verify(sample);

   t.deepEqual(sample, data, error);

})


test('{String}', t => {

   const sample = {
      x: "hello",
      y: "word"
   }

   const { error, data } = types({
      x: String,
      y: String
   }).verify(sample);

   t.deepEqual(sample, data, error);

})