## Installation

      npm install check-data --save

## 使用

    let Validator = require('check-data')
    
    let { error, data, $, ... } = Validator(data, options, constructor)

## 输入参数

*  `data` *Objcte* - 导入验证数据

*  `options` *Objcte* - 数据验证表达式

*  `constructor` *Objcte* - 导出数据自定义构造方法（可选）

## 输出结果

*  `error` *String* - 输出错误信息

*  `data` *Objcte* - 经过验证、过滤后导出数据

*  `${name}` *Objcte* - 由constructor对象中构造器生成的对象，命名与构造器名称一致


## 选项说明

> 当只需要验证数据类型时可以直接用type赋值，不需要使用对象表达式

### 通用选项

* `type` * - 用于定义数据类型，可选为String、Number、Object、 Array、Date、Boolean、"ObjectId"、"MobilePhone"，带引号字符串表示扩展类型（必选）

* `name` *String* - 自定义参数名称，用于错误返回值中替换默认参数名

* `default` * - 值为空时使用默认值

* `allowNull` *Boolean* - 是否允许为空，默认为true

* `and` *Array* - 依赖的参数名数组

* `or` *Array* - 依赖的参数名数组

* `method` *Function* - 参数自定义转换方法


### 内置数据类型（用构造函数表示）

#### String

* `minLength` *Number* - 限制字符串最小长度

* `maxLength` *Number* - 限制字符串最大长度

* `reg` *RegExp* - 正则表达式验证

* `in` *Array* - 匹配多个可选值中的一个

#### Number

* `min` *Number* - 限制最小值

* `max` *Number* - 限制最大值

* `in` *Array* - 匹配多个可选值中的一个

* `to` * - 类型转换，仅支持Boolean值

#### Date、Array、Object、Boolean

> 仅支持类型验证


### 扩展类型（用字符串表示）

#### 'ObjectId'

> 表示mongodb中的ObjectId

#### 'MobilePhone'

> 表示手机号


## 使用示例

#### 验证数据

      let data = {
         "tenderName": "测试",
         "tenderNum": "123456789987",
         "tenderEndTime": "2017-07-07T09:53:30.000Z",
         "files": ["abc.js", "334", "null", "666", , , "kkk.js"],
         "auth": {
               "weixin": "abc",
         },
         "beneficiariesName": "莉莉",
         "guaranteeMoney": 2,
         "guaranteeFormat": 0,
         "addressee": "嘟嘟",
         "receiveAddress": "北京市",
         "phone": "18666666666",
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

      let { error, data, filter } = Validator(query,
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
               "allowNull": false,
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
                  return [value, , , "xx"]
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
               return {
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
               }
            }
         }
      )


## 相同数据结构和类型的可复用表达式

      let { error, data } = Validator({
         "t0": false,
         "t1": false,
         "t2": true,
         "t3": true,
         "t4": false,
         "t5": true,
         "t6": true,
         "t7": false,
         "t8": true
      }, {
         $: {
            type: Boolean,
            allowNull: true,
         }
      })


## 数组验证

      let { error, data } = Validator(["a.js", "b.js", "c.js"], [String])


## 扩展数据类型验证

      let { error, data } = Validator({
         "id": "5968d3b4956fe04299ea5c18",
         "mobilePhone": "18555555555"
      }, {
         "id": "ObjectId",
         "mobilePhone": "MobilePhone"
      })


## 关联验证，用于存在参数依赖关系的非空值验证

      # 与
      let { error, data } = Validator({
         "username": "莉莉",
         "addressee": "嘟嘟",
      }, {
         "username": {
            "type": String,
            "and": ["addressee", "address"]
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

      # 或
      let { error, data } = Validator({
         "username": "莉莉",
         "addressee": "嘟嘟",
      }, {
         "username": {
            "type": String,
            "or": ["addressee", "address"]
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