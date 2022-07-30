import test from 'jtm'
import { Schema, number, string, object, any } from 'typea';

test('mixing', t => {

  const { email, mobilePhone } = Schema.types;

  const schema = new Schema({
    username: string({
      comment: "用户名",
      default: "lili"
    }),
    "num": number({ set() { return 666; } }),
    "objectId": string,
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
      ...object({
        "username": String,
        "age": { "kk": [...object({ kkk: Number })] },
      })
    ],
    "money": number({
      "min": 1,
      "in": [1, 2],
    }),
    "files": [string({ optional: true }), ...string],
    "guaranteeFormat": number,
    "addressee": String,
    "search": "双鸭山",
    "phone": mobilePhone,
    "coupon": any({ set(gt) { return { gt } } }),
    "integral": {
      "lala": Number,
      "kaka": number({ "in": [1, 3, 8, 6] })
    },
    "email": email({ set(value: string) { return value.trim() } }),
    "arr": [...string],
  });

  const sample = {
    "username": "lili",
    "num": 123456789987,
    "objectId": "59c8aea808deec3fc8da56b6",
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
    "email": "xxx@xx.com",
    "arr": ['jjsd', 'ddd']
  }

  const { error, value } = schema.verify(sample);

  t.ok(value, error);

});