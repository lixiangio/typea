"use strict"

import test from 'ava';
import Check from '..';

let sample = {
   "name": "测试",
   "num": "123456789987",
   "ObjectId": "59c8aea808deec3fc8da56b6",
   "files": ["abc.js", "334", "null", "666", "12"],
   "user": {
      "username": "莉莉",
      "age": 18,
      "address": [
         {
            "city": "深圳",
         },
         {
            "city": "北京",
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
            "kk": [
               { kkk: 666 },
               { kkk: 999 }
            ]
         },
      }
   ],
   "money": "2",
   "guaranteeFormat": 0,
   "addressee": "嘟嘟",
   "phone": "18565799072",
   "coupon": "uuuu",
   "integral": {
      "lala": "168",
      "kaka": 6,
   },
   "search": "深圳",
   "searchField": "userName",
   "email": "xxx@xx.xx",
   "arr": ['jjsd', 'ddd']
}

let { mongoId, email, mobilePhone } = Check.types


test('结构镜像', t => {

   let { error, data } = Check(sample, {
      "name": String,
      "num": String,
      "ObjectId": mongoId,
      "files": [String],
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
               "kk": [
                  { kkk: Number },
                  { kkk: Number }
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
      "arr": [String]
   })

   // console.log(data)
   
   t.truthy(data, error);

});


test('结构、值镜像', t => {

   let { error, data } = Check(sample, sample)

   // console.log(data)

   t.truthy(data, error);

});