import test from 'jtm';
import { Schema } from 'typea';

test('symbol', t => {

   const sample = Symbol('x');

   const schema = Schema(Symbol)

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})

test('symbol[]', t => {

   const sample = [Symbol('x'), Symbol('y')];

   const schema = Schema([...Symbol])

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})

test('{ [name: string]: symbol }', t => {

   const sample = {
      x: Symbol('x'),
      y: Symbol('y'),
   }

   const schema = Schema({
      x: Symbol,
      y: Symbol
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

})
