import test from 'jtm';
import types from 'typea';

const { mongoId, email, mobilePhone } = types;

const sample = {
   "name": "测试",
   "num": "123456789987",
   "ObjectId": "59c8aea808deec3fc8da56b6",
   "files": ["abc.js", "334", "null", "666", "12"],
   "user": {
      "username": "莉莉",
      "age": 18,
      "address": [
         {
            "city": "双鸭山",
         },
         {
            "city": "萨克斯",
         }
      ],
   },
   "list": [
      {
         "username": "吖吖",
         "age": {
            "kk": [{ kkk: 666 }]
         },
      },
      {
         "username": "可可",
         "age": {
            "k": [
               { ka: 666 },
               { ks: 999 }
            ]
         },
      }
   ],
   "money": 2,
   "guaranteeFormat": 1,
   "addressee": "嘟嘟",
   "phone": "18565799072",
   "coupon": "uuuu",
   "integral": {
      "lala": "168",
      "kaka": 6,
   },
   "search": "双鸭山",
   "searchField": "userName",
   "email": "xxx@xx.xx",
   "arr": ['jjsd', 'ddd']
}


test('结构镜像', t => {

   const { error, data } = types({
      "name": String,
      "num": String,
      "ObjectId": mongoId,
      "files": [...String],
      "user": {
         "username": String,
         "age": Number,
         "address": [
            {
               "city": String,
            },
            {
               "city": String,
            }
         ],
      },
      "list": [
         {
            "username": String,
            "age": {
               "kk": [{ kkk: Number }]
            },
         },
         {
            "username": String,
            "age": {
               "k": [
                  { ka: Number },
                  { ks: Number }
               ]
            },
         }
      ],
      "money": Number,
      "guaranteeFormat": Number,
      "addressee": String,
      "phone": mobilePhone,
      "coupon": String,
      "integral": {
         "lala": String,
         "kaka": Number,
      },
      "search": String,
      "searchField": String,
      "email": email,
      "arr": [...String]
   }).verify(sample);

   // console.log(data)

   t.ok(data, error);

});


test('结构、值镜像', t => {

   const { error, data } = types(sample).verify(sample);

   // console.log(data);

   t.ok(data, error);

});