"use strict"

const test = require('jtf')
const Check = require('..')

test('number', t => {

   let { error, data } = Check(1212, Number)

   // console.log(data);

   t.deepEqual(1212, data, error);

});