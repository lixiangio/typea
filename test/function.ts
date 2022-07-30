import test from 'jtm';
import { Schema } from 'typea';

test('sync function', t => {

   function func() { }

   const { error, value } = new Schema(Function).verify(func);

   t.deepEqual(func, value, error);

});

test('async function', t => {

   async function func() { }

   const result = new Schema(Function).verify(func);

   t.deepEqual(func, result.value, result.error);

});


test('function', t => {

   const func = (v: number) => { return v + 1; }

   const { error, value } = new Schema((fn: Function) => fn(1)).verify(func);

   t.deepEqual(func, value, error);

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
