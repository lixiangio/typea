"use strict"

const test = require('jtf')
const Check = require('..')

test('extend', t => {

   let { mongoId, email, mobilePhone } = Check.types

   let sample = {
      "id": "5687862c08d67e29cd000001",
      "email": "erer@gmail.com",
      "mobile": "15855555547",
   }

   let { error, data } = Check(sample,
      {
         "id": {
            "type": mongoId,
            "allowNull": false
         },
         "email": {
            "type": email,
         },
         "mobile": {
            "type": mobilePhone,
         },
      },
      {
         xxx({ id, email }) {
            return [id, email]
         },
         sss({ mobile }) {
            return {
               kkk: 1212,
               mobile
            }
         },
         ccc: 666
      }
   )

   // console.log(data)

   t.deepEqual({
      id: '5687862c08d67e29cd000001',
      email: 'erer@gmail.com',
      mobile: '15855555547',
      xxx: ['5687862c08d67e29cd000001', 'erer@gmail.com'],
      sss: { kkk: 1212, mobile: '15855555547' },
      ccc: 666
   }, data, error);

});