import test from 'jtm';
import { Schema, string } from 'typea';

test('string', t => {

   const sample = 'a';

   const { error, data } = new Schema(string).verify(sample);

   t.deepEqual(data, sample, error);

})

test('string[] or [string]', t => {

   const sample = ['a', 'b', 'c'];

   const { error, data } = new Schema([...string]).verify(sample);

   t.deepEqual(data, sample, error);

})

test('[string, string]', t => {

   const sample = ['a', 'b'];

   // console.log(string)

   const { error, data } = new Schema([string, String]).verify(sample);

   t.deepEqual(data, sample, error);

})

test('{string}', t => {

   const schema = new Schema({
      x: String,
      y: string({ default: 'word' })
   })

   const sample = {
      x: "hello"
   }

   const { error, data } = schema.verify(sample);

   // console.log(data)
   sample.y = "word";

   t.deepEqual(data, sample, error);

})


test('{...string}', t => {

   const schema = new Schema({ ...String })

   const sample = {
      x: "hello",
      y: "word"
   }

   const { error, data } = schema.verify(sample);

   // console.log(data)

   t.deepEqual(data, sample, error);

})

test('[...string]', t => {

   const schema = new Schema([...string])

   const sample = ["hello", "word"];

   const { error, data } = schema.verify(sample);

   // console.log(data)

   t.deepEqual(data, sample, error);

})