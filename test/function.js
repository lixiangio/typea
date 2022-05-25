import test from 'jtm';
import { Schema } from 'typea';

test('sync function', t => {

   function func() { }

   const { error, data } = Schema(Function).verify(func);

   t.deepEqual(func, data, error);

});

test('async function', t => {

   async function func() { }

   const result = Schema(Function).verify(func);

   t.deepEqual(func, result.data, result.error);

});


test('function', t => {

   const func = (v) => { return v + 1; }

   const { error, data } = Schema((fn) => fn(1)).verify(func);

   t.deepEqual(func, data, error);

});


test('function express', t => {

   const sample = {
      name: 'lili',
      a(a, b) { return a + b },
      b(a, b) { return a * b },
      c() { },
   };

   const schema = Schema({
      name: String,
      a(fn, set) {
         sample.a = fn(1, 1);
         set(sample.a);
      },
      b(fn, set) {
         sample.b = fn(1, 2);
         set(sample.b)
      },
      c() { }
   });

   const { data, error } = schema.verify(sample);

   t.deepEqual(data, sample, error);

});
