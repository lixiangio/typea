## Installation

      npm install check-data --save


## 使用方法

    let verify = Verify(data, options)

*  `data` *Objcte* - 验证数据

*  `options` *Objcte* - 验证数据表达式

*  `constructor` *Objcte* - 数据构造器

## 导出验证结果

*  `verify.error` *String* - 错误信息

*  `verify.data` *Objcte* - 验证数据

*  `verify.${name}` *Objcte* - 由constructor对象中构造器生成的对象，命名与构造器名称一致


## 使用示例

#### 验证数据

      let data = {
         "tenderName": "测试",
         "tenderNum": "123456789987",
         "tenderEndTime": "2017-07-07T09:53:30.000Z",
         "files": ["abc.js", "334", "null", "666", , , , , , "kkk.js"],
         "auth": {
               "weixin": "llll",
         },
         "beneficiariesName": "莉莉",
         "guaranteeMoney": 2,
         "guaranteeFormat": 0,
         // "addressee": "嘟嘟",
         "receiveAddress": "快点快点的",
         "phone": "18565799072",
         "coupon": "uuuu",
         "integral": {
               "lala": 168,
               "kaka": "3"
         },
         "search": "深圳",
         "email": "xxx@xx.xx",
         "key": {
               a: "1",
               b: 2,
               c: 666,
               d: 4
         }
      }

#### 验证数据表达式

      let { error, data, filter } = Verify(query,
         {
            "tenderName": {
               "type": String,
               "name": "标书名称",
               "allowNull": false
            },
            "tenderNum": String,
            "tenderEndTime": {
               "type": Date,
               "name": "截标时间",
               "allowNull": false,
            },
            "auth": {
               "weixin": String,
            },
            "beneficiariesName": String,
            "guaranteeMoney": {
               "type": Number,
               "in": [1, 2]
            },
            "files": [{
               "type": String,
               // "allowNull": false,
            }],
            "guaranteeFormat": {
               "type": Number,
               "conversion": Boolean
            },
            "addressee": {
               "type": String,
            },
            "search": {
               "type": String,
            },
            "phone": {
               "type": "MobilePhone"
            },
            "receiveAddress": String,
            "coupon": {
               "type": String,
               method(value) {
                  return { "$gt": new Date() }
               }
            },
            "integral": {
               "lala": {
                  "type": Number,
               },
               "kaka": {
                  "type": Number,
                  "in": [1, 2, 3],
               }
            },
            "email": {
               "type": String,
               "default": "releaseTime",
               method(value) {
                  return [value, , , , , "7777"]
               }
            },
            "key": {
               "$": {
                  type: Number,
               }
            },
         },
         {
            filter() {
               let { search, email, integral } = this
               let output = {
                  "email": email,
                  "integral": integral,
                  "test": {
                     a: 1,
                     b: undefined,
                     c: "",
                     d: null,
                     e: NaN,
                     e: 0,
                  },
                  $or() {
                     if (search.match(/^\d+$/)) {
                        return [
                           { tenderNum: new RegExp(search) },
                           { projectNum: new RegExp(search) },
                           { tenderProjectNum: new RegExp(search) }
                        ]
                     } else {
                        return [
                           { tenderName: new RegExp(search) },
                           { projectName: new RegExp(search) },
                           { tenderProjectName: new RegExp(search) }
                        ]
                     }
                  },
                  totalAmount() {
                     return {
                        $gt: /12/,
                        $lt: 888,
                     }
                  },
               }
               return output
            }
         }
      )


## 相同数据结构的可复用表达式

#### 验证数据

      let data = {
         "t0": false,
         "t1": false,
         "t2": true,
         "t3": true,
         "t4": false,
         "t5": true,
         "t6": true,
         "t7": false,
         "t8": true
      }

#### 表达式

      let verify = Verify(data, {
         $: {
            type: Boolean,
            allowNull: true,
         }
      })


## 数组验证

#### 验证数据

      let data = ["a.js", "b.js", "c.js"]

#### 表达式

      let verify = Verify(data, [String])


## 自定义类型

#### 验证数据

      let data = {
         "id": "5968d3b4956fe04299ea5c18",
         "mobilePhone": "18555555555"
      }

#### 表达式

      let verify = Verify(data, {
         "id": "ObjectId",
         "mobilePhone": "MobilePhone"
      })


## 关联验证，用于存在依赖关系的非空数据验证

#### 验证数据

      let data = {
         "username": "莉莉",
         "addressee": "嘟嘟",
      }

#### 表达式

      let verify = Verify(data, {
         "username": {
            "type": String,
            "&": ["addressee", "address"]
         },
         "addressee": {
            "type": String,
            "allowNull": true
         },
         "address": {
            "type": String,
            "allowNull": true
         }
      })