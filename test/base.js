"use strict"

const test = require('jtf');
const typea = require('..');


test('String', t => {

   const sample = "hello"

   const { error, data } = typea(String).verify(sample);

   t.deepEqual(sample, data, error);

})


test('Number', t => {

   const sample = 123

   const { error, data } = typea(Number).verify(sample);

   t.deepEqual(sample, data, error);

})


test('Object', t => {

   const sample = {}

   const { error, data } = typea(Object).verify(sample);

   t.deepEqual(sample, data, error);

})


test('Array', t => {

   const sample = [1, 23, 'x']

   const { error, data } = typea(Array).verify(sample);

   t.deepEqual(sample, data, error);

})


test('String in Array', t => {

   const sample = ['a', 'b', 'c']

   const { error, data } = typea([String]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('Number in Array', t => {

   const sample = [1, 2, 3]

   const { error, data } = typea([Number]).verify(sample);

   t.deepEqual(sample, data, error);

})


test('Number in Object', t => {

   const sample = {
      x: 1,
      y: 2
   }

   const { error, data } = typea({
      x: Number,
      y: Number
   }).verify(sample);

   t.deepEqual(sample, data, error);

})


test('String in Object', t => {

   const sample = {
      x: "hello",
      y: "word"
   }

   const { error, data } = typea({
      x: String,
      y: String
   }).verify(sample);

   t.deepEqual(sample, data, error);

})