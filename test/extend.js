"use strict"

import test from 'ava';
import Check from '..';


Check.use('Int', {
   type({ data }) {
      if (Number.isInteger(data)) {
         return { data }
      } else {
         return { error: '必须为Int类型' }
      }
   },
})

test('extend', t => {
   let { error, data } = Check(
      {
         "name": 666,
      },
      {
         "name": {
            "type": 'Int',
            "name": "名称",
            "allowNull": false,
            "default": "默认值",
         }
      }
   )

   t.truthy(data, error);

});