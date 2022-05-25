import test from 'jtm';
import { Schema, number } from 'typea';

test('number', t => {

   const sample = 1;

   const { error, data } = Schema(Number).verify(sample);

   t.deepEqual(data, sample, error);

})


test('number[] or [number]', t => {

   const sample = [1, 2, 3]

   const { error, data } = Schema([...Number]).verify(sample);

   t.deepEqual(data, sample, error);

})


test('[number, number]', t => {

   const sample = [1, 2]

   // console.log(number({ optional: true }).name)
   // const xx = [...number({ optional: true })]
   // console.log(xx[0][extensionNode].name)
   
   const { error, data } = Schema([Number, number, number({ optional: true })]).verify(sample);

   t.deepEqual(data, sample, error);

})


test('{ number }', t => {

   const sample = {
      x: 1,
      // y: 2
   }

   const schema = Schema({
      x: Number,
      y: number({ default: 12 })
   })

   const { error, data } = schema.verify(sample);

   sample.y = 12;

   // console.log(data)

   t.deepEqual(data, sample, error);

})


test('{ ...number }', t => {

   const schema = Schema({ ...Number })

   const sample = {
      x: 1,
      y: 2
   }

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})
