import test from 'jtm';
import types from 'typea';

const { any } = types;

test('string', t => {

   const sample = 'a';

   const { error, data } = types(String).verify(sample);

   t.deepEqual(sample, data, error);

})

test('string[] or [string]', t => {

   const sample = ['a', 'b', 'c']

   const { error, data } = types([String]).verify(sample);

   t.deepEqual(sample, data, error);

})

test('[string, string]', t => {

   const sample = ['a', 'b']

   const { error, data } = types([String, String]).verify(sample);

   t.deepEqual(sample, data, error);

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

   t.deepEqual(sample, data, error);

})


test('number', t => {

   const sample = 1;

   const { error, data } = types(Number).verify(sample);

   t.deepEqual(sample, data, error);

})


test('number[] or [number]', t => {

   const sample = [1, 2, 3]

   const { error, data } = types([Number]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('[number, number]', t => {

   const sample = [1, 2]

   const { error, data } = types([Number, Number]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('{ [name: string]: number }', t => {

   const sample = {
      x: 1,
      y: 2
   }

   const schema = types({
      x: Number,
      y: Number
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})


test('symbol', t => {

   const sample = Symbol('x');

   const schema = types(Symbol)

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})

test('symbol[]', t => {

   const sample = [Symbol('x'), Symbol('y')];

   const schema = types([Symbol])

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})

test('{ [name: string]: sample }', t => {

   const sample = {
      x: Symbol('x'),
      y: Symbol('y'),
   }

   const schema = types({
      x: Symbol,
      y: Symbol
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})

test('any', t => {

   const sample = {
      x: 123,
      y: '',
   }

   const schema = types(any);

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

})

test('any[]', t => {

   const sample = [{
      x: 123,
      y: '',
   }]

   const schema = types([any]);

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

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

   t.deepEqual(sample, data, error);

})