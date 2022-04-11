import test from 'jtm'
import types from 'typea';

const sample = {
  "name": "测试",
  "num": 123456789987,
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
        "kk": [
          { kkk: 666 },
          { kkk: 999 }
        ]
      },
    }
  ],
  "money": 2,
  "guaranteeFormat": 0,
  "addressee": "嘟嘟",
  "phone": "18565799072",
  "coupon": "uuuu",
  "integral": {
    "lala": 168,
    "kaka": 6,
  },
  "search": "双鸭山",
  "searchField": "userName",
  "email": "xxx@xx.xx",
  "arr": ['jjsd', 'ddd']
}

test('mixing', t => {

  const { number, string, mongoId, email, mobilePhone } = types;

  const schema = types({
    "name": string({
      "name": "名称",
      "allowNull": false,
      "default": "默认值"
    }),
    "num": number({ set() { return 666; } }),
    "ObjectId": mongoId,
    "user": {
      "username": "莉莉",
      "age": Number,
      "address": [
        {
          "city": String,
        },
        {
          "city": "萨克斯",
        }
      ],
    },
    "list": [
      {
        "username": String,
        "age": {
          "kk": [{ kkk: Number }]
        },
      }
    ],
    "money": number({
      "min": 1,
      "in": [1, 2],
    }),
    "files": [string({ "allowNull": false })],
    "guaranteeFormat": number,
    "addressee": String,
    "search": "双鸭山",
    "phone": mobilePhone,
    "coupon": string({ set($gt) { return { $gt } } }),
    "integral": {
      "lala": Number,
      "kaka": number({
        "allowNull": false,
        "in": [1, 3, 8, 6],
      })
    },
    "email": email({
      set(value) {
        return [value, undefined, null, undefined, undefined, 666]
      }
    }),
    "arr": [String],
  })

  const { error, data } = schema.verify(sample);

  // console.log(data)
  // t.deepEqual(sample, data, error);
  
  t.ok(data, error);

});