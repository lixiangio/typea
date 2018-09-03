"use strict"

const test = require('jtf')
const Check = require('..')


test('string', t => {

   let { error, data } = Check("xxx", String)

   // console.log(data);

   t.deepEqual('xxx', data, error);

});