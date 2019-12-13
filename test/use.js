"use strict";

const test = require('jtf');
const typea = require('..');

typea.use('int', {
   type(data) {
      if (Number.isInteger(data)) {
         return { data }
      } else {
         return { error: '必须为int类型' }
      }
   },
   max(data, max) {
      if (data > max) {
         return { error: `不能大于${max}` }
      } else {
         return { data }
      }
   },
   in(data, array) {
      const result = array.indexOf(data)
      if (result === -1) {
         return { error: `值必须为${array}中的一个` }
      } else {
         return { data }
      }
   }
})

const { mongoId, email, mobilePhone, int } = typea.types

test('extend', t => {

   const sample = {
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
      "v": 6
   }

   const { error, data } = typea(sample, {
      "id": {
         "type": mongoId,
         "allowNull": false
      },
      "age": {
         "type": int,
         "allowNull": false,
         "max": 50,
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
      "v": {
         "type": int,
         "in": [3, 5, 7, 6]
      }
   })

   t.deepEqual({
      id: '5687862c08d67e29cd000001',
      age: 56,
      email: 'erer@gmail.com',
      mobile: '15855555547',
      mobileArr: ['15855155547', '18955535547'],
      "v": 6 
   }, data, error);

});