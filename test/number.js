import test from 'jtm';
import types from 'typea';

const { number } = types;

test('number', t => {

   const sample = 1;

   const { error, data } = types(Number).verify(sample);

   t.deepEqual(data, sample, error);

})


test('number[] or [number]', t => {

   const sample = [1, 2, 3]

   const { error, data } = types([...Number]).verify(sample);

   t.deepEqual(data, sample, error);

})


test('[number, number]', t => {

   const sample = [1, 2]

   const { error, data } = types([Number, Number]).verify(sample);

   t.deepEqual(data, sample, error);

})


test('{ [name: string]: number }', t => {

   const sample = {
      x: 1,
      // y: 2
   }

   const schema = types({
      x: Number,
      y: number({ default: 12 })
   })

   const { error, data } = schema.verify(sample);

   sample.y = 12;

   // console.log(data)

   t.deepEqual(data, sample, error);

})

