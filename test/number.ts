import test from 'jtm';
import { Schema, number } from 'typea';

interface Sample {
   [name: string]: any
}

test('number', t => {

   const sample = 1;

   const { error, value } = new Schema(Number).verify(sample);

   t.deepEqual(value, sample, error);

})


test('number[] or [number]', t => {

   const sample = [1, 2, 3]

   const { error, value } = new Schema([...number]).verify(sample);

   t.deepEqual(value, sample, error);

})


test('[number, number]', t => {

   const sample = [1, 2]

   // console.log(number({ optional: true }).name)
   // const xx = [...number({ optional: true })]
   // console.log(xx[0][extensionNode].name)

   const { error, value } = new Schema([Number, number, number({ optional: true })]).verify(sample);

   t.deepEqual(value, sample, error);

})


test('{ number }', t => {

   const sample: Sample = {
      x: 1,
      // y: 2
   }

   const schema = new Schema({
      x: Number,
      y: number({ default: 12 })
   })

   const { error, value } = schema.verify(sample);

   sample.y = 12;

   // console.log(value)

   t.deepEqual(value, sample, error);

})


test('{ ...number }', t => {

   const schema = new Schema({ ...number })

   const sample = {
      x: 1,
      y: 2
   }

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

})
