"use strict"

import test from 'ava';
import Check from '..';


test(t => {

   let { error, data } = Check("xxx", String)

   // console.log(data);

   t.deepEqual('xxx', data, error);

});