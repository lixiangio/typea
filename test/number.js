"use strict"

const test = require('jtf')
const typea = require('..').default

test('number', t => {

   const { error, data } = typea(Number).verify(1212);

   // console.log(data);

   t.deepEqual(1212, data, error);

});