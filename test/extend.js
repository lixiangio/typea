"use strict"

import test from 'ava';
import Check from '..';

Check.use('int', {
   type({ data }) {
      if (Number.isInteger(data)) {
         return { data }
      } else {
         return { error: '必须为int类型' }
      }
   },
})

let { mongoId, email, mobilePhone, int } = Check.types

test(t => {

   let sample = {
      "id": "5687862c08d67e29cd000001",
      "age": 28,
      "email": "erer@gmail.com",
      "mobile": "15855555547",
      "mobileArr": [
         "15855155547",
         "18955535547",
         "13055655547",
         "18655655512",
         "15055655512"
      ],
      "mobileArr2": [
         "13055656647",
         "18655655512",
         "15055699512",
         "15855155547"
      ],
   }

   let { error, data } = Check(sample, {
      "id": {
         "type": mongoId,
         "allowNull": false
      },
      "age": {
         "type": int,
         "allowNull": false
      },
      "email": {
         "type": email,
      },
      "mobile": {
         "type": mobilePhone,
      },
      "mobileArr": [mobilePhone],
      "mobileArr2": [
         mobilePhone,
         "18655655512",
         mobilePhone,
         {
            type: mobilePhone,
            "allowNull": false
         }
      ]
   })

   // console.log(data)

   t.deepEqual(sample, data, error);

});