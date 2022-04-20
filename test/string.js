import test from 'jtm';
import types from 'typea';

const { string } = types;

test('string', t => {

   const sample = 'a';

   const { error, data } = types(string).verify(sample);

   t.deepEqual(data, sample, error);

})

test('string[] or [string]', t => {

   const sample = ['a', 'b', 'c'];

   const { error, data } = types([...string]).verify(sample);

   t.deepEqual(data, sample, error);

})

test('[string, string]', t => {

   const sample = ['a', 'b'];

   const { error, data } = types([string, String]).verify(sample);

   t.deepEqual(data, sample, error);

})

test('{ [name: string]: string }', t => {

   const sample = {
      x: "hello",
      // y: "word"
   }

   const schema = types({
      x: String,
      y: string({ default: 'word' })
   })

   const { error, data } = schema.verify(sample);

   // console.log(data)
   sample.y = "word";

   t.deepEqual(data, sample, error);

})
