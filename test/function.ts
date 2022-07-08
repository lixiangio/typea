import test from 'jtm';
import { Schema } from 'typea';

test('sync function', t => {

   function func() { }

   const { error, data } = new Schema(Function).verify(func);

   t.deepEqual(func, data, error);

});

test('async function', t => {

   async function func() { }

   const result = new Schema(Function).verify(func);

   t.deepEqual(func, result.data, result.error);

});


test('function', t => {

   const func = (v: number) => { return v + 1; }

   const { error, data } = new Schema((fn: Function) => fn(1)).verify(func);

   t.deepEqual(func, data, error);

});


test('function express', t => {

   const sample = {
      name: 'lili',
      a(a: number, b: number) { return a + b },
      b(a: number, b: number) { return a * b },
      c() { },
   };

   const schema = new Schema({
      name: String,
      a(fn: Function, set: Function) {
         sample.a = fn(1, 1);
         set(sample.a);
      },
      b(fn: Function, set: Function) {
         sample.b = fn(1, 2);
         set(sample.b)
      },
      c() { }
   });

   const { data, error } = schema.verify(sample);

   t.deepEqual(data, sample, error);

});
