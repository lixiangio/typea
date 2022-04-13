import test from 'jtm';
import types from 'typea';

const { any } = types;

test('any', t => {

   const sample = {
      x: 123,
      y: '',
   }

   const schema = types(any);

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})

test('any[]', t => {

   const sample = [{
      x: 123,
      y: '',
   }]

   const schema = types([...any]);

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})

test('{ [name: string]: any }', t => {

   const sample = {
      x: 123,
      y: {},
   }

   const schema = types({
      x: any,
      y: any
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})