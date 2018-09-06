"use strict"

const test = require('jtf')
const typea = require('..')

test('number', t => {

   let { error, data } = typea(1212, Number)

   // console.log(data);

   t.deepEqual(1212, data, error);

});