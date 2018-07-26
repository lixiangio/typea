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
   max({ data, option: max }) {
      if (data > max) {
         return { error: `不能大于${max}` }
      } else {
         return { data }
      }
   },
   in({ data, option: arr }) {
      let result = arr.indexOf(data)
      if (result === -1) {
         return { error: `值必须为${arr}中的一个` }
      } else {
         return { data }
      }
   }
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
      ],
      "mobileArr2": [
         "13055656647",
         "18655655512"
      ],
   }

   let { error, data } = Check(sample, {
      "id": {
         "type": mongoId,
         "allowNull": false
      },
      "age": {
         "type": int,
         "allowNull": false,
         set(value) {
            return value * 2
         }
      },
      "email": {
         "type": email,
      },
      "mobile": {
         "type": mobilePhone,
      },
      "mobileArr": [
         mobilePhone,
         {
            "type": mobilePhone,
            "allowNull": false
         }
      ],
      "mobileArr2": [
         mobilePhone,
         "18655655512"
      ]
   })

   // console.log(data)

   t.deepEqual({
      id: '5687862c08d67e29cd000001',
      age: 56,
      email: 'erer@gmail.com',
      mobile: '15855555547',
      mobileArr: ['15855155547', '18955535547'],
      mobileArr2: ['13055656647', '18655655512']
   }, data, error);

});