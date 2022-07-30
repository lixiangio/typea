import test from 'jtm';
import { Schema, symbol } from 'typea';

test('symbol', t => {

   const sample = Symbol('x');

   const schema = new Schema(Symbol)

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

})

test('symbol[]', t => {

   const sample = [Symbol('x'), Symbol('y')];

   const schema = new Schema([...symbol])

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

})

test('{ [name: string]: symbol }', t => {

   const sample = {
      x: Symbol('x'),
      y: Symbol('y'),
   }

   const schema = new Schema({
      x: Symbol,
      y: Symbol
   });

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

})
