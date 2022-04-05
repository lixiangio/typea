import test from 'jtm'
import types from 'typea';

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
  "search": "双鸭山",
  "searchField": "userName",
  "email": "xxx@xx.xx",
  "arr": ['jjsd', 'ddd']
}

test('mixing', t => {

  const { mongoId, email, mobilePhone } = types;

  const schema = types({
    "name": {
      "type": String,
      "name": "名称",
      "allowNull": false,
      "default": "默认值"
    },
    "num": {
      "type": Number,
      "value": 666,
    },
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
    "money": {
      "type": Number,
      "min": 1,
      "in": [1, 2],
    },
    "files": [{
      "type": String,
      "allowNull": false,
    }],
    "guaranteeFormat": {
      "type": Number,
      "to": Boolean,
    },
    "addressee": String,
    "search": "双鸭山",
    "phone": {
      "type": mobilePhone
    },
    "coupon": {
      "type": String,
      set($gt) {
        return { $gt }
      }
    },
    "integral": {
      "lala": {
        "type": Number,
      },
      "kaka": {
        "type": Number,
        "allowNull": false,
        "in": [1, 3, 8, 6],
      }
    },
    "email": {
      "type": email,
      set(value) {
        return [value, undefined, null, undefined, undefined, 666]
      }
    },
    "arr": [String],
  })

  const { error, data } = schema.verify(sample, {
    filter({ email, integral }) {
      return {
        email,
        integral,
        "test": {
          v1: 1,
          v2: undefined,
          v3: "",
          v4: null,
          v5: NaN,
          v6: 0,
        }
      }
    },
    where({ email, integral }) {
      return {
        email,
        integral,
        "test": {
          v1: 1,
          v2: undefined,
          v3: "",
          v4: null,
          v5: NaN,
          v6: 0,
        }
      }
    }
  });

  // console.log(data)

  t.ok(data, error);

});