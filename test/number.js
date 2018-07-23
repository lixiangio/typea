"use strict"

import test from 'ava';
import Check from '..';


test(t => {

   let { error, data } = Check(1212, Number)

   // console.log(data);

   t.deepEqual(1212, data, error);

});