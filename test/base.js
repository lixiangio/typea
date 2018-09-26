"use strict"

const test = require('jtf')
const typea = require('..')


test('String', t => {

   const sample = "hello"

   const { error, data } = typea(sample, String)

   t.deepEqual(sample, data, error);

})


test('Number', t => {

   const sample = 123

   const { error, data } = typea(sample, Number)

   t.deepEqual(sample, data, error);

})


test('Object', t => {

   const sample = {}

   const { error, data } = typea(sample, Object)

   t.deepEqual(sample, data, error);

})


test('Array', t => {

   const sample = [1, 23, 'x']

   const { error, data } = typea(sample, Array)

   t.deepEqual(sample, data, error);

})


test('String in Array', t => {

   const sample = ['a', 'b', 'c']

   const { error, data } = typea(sample, [String])

   t.deepEqual(sample, data, error);

})


test('Number in Array', t => {

   const sample = [1, 2, 3]

   const { error, data } = typea(sample, [Number])

   t.deepEqual(sample, data, error);

})


test('Number in Object', t => {

   const sample = {
      x: 1,
      y: 2
   }

   const { error, data } = typea(sample, {
      x: Number,
      y: Number
   })

   t.deepEqual(sample, data, error);

})


test('String in Object', t => {

   const sample = {
      x: "hello",
      y: "word"
   }

   const { error, data } = typea(sample, {
      x: String,
      y: String
   })

   t.deepEqual(sample, data, error);

})