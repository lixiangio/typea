import test from 'jtm';
import types from 'typea';

test('string', t => {

   const sample = 'a';

   const { error, data } = types(String).verify(sample);

   t.deepEqual(data, sample, error);

})

test('string[] or [string]', t => {

   const sample = ['a', 'b', 'c'];

   const { error, data } = types([...String]).verify(sample);

   t.deepEqual(data, sample, error);

})

test('[string, string]', t => {

   const sample = ['a', 'b'];

   const { error, data } = types([String, String]).verify(sample);

   t.deepEqual(data, sample, error);

})

test('{ [name: string]: string }', t => {

   const sample = {
      x: "hello",
      y: "word"
   }

   const schema = types({
      x: String,
      y: String
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})
