import test from 'jtm';
import { Schema, string } from 'typea';

test('string', t => {

   const sample = 'a';

   const { error, value } = new Schema(string).verify(sample);

   t.deepEqual(value, sample, error);

})

test('string[] or [string]', t => {

   const sample = ['a', 'b', 'c'];

   const { error, value } = new Schema([...string]).verify(sample);

   t.deepEqual(value, sample, error);

})

test('[string, string]', t => {

   const sample = ['a', 'b'];

   // console.log(string)

   const { error, value } = new Schema([string, String]).verify(sample);

   t.deepEqual(value, sample, error);

})

test('{string}', t => {

   const schema = new Schema({
      x: String,
      y: string({ default: 'word' })
   })

   const sample: { [n: string]: any } = {
      x: "hello"
   }

   const { error, value } = schema.verify(sample);

   // console.log(value)
   sample.y = "word";

   t.deepEqual(value, sample, error);

})


test('{...string}', t => {

   const schema = new Schema({ ...string })

   const sample = {
      x: "hello",
      y: "word"
   }

   const { error, value } = schema.verify(sample);

   // console.log(value)

   t.deepEqual(value, sample, error);

})

test('[...string]', t => {

   const schema = new Schema([...string])

   const sample = ["hello", "word"];

   const { error, value } = schema.verify(sample);

   // console.log(value)

   t.deepEqual(value, sample, error);

})