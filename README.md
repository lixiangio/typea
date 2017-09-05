## Installation

      npm install check-data --save

## 使用方法

    let Validator = require('check-data')
    
    let { error, data, $, ... } = Validator(data, options, constructor)

## 输入

*  `data` * - 输入验证数据，类型参考type选项

*  `options` * - 数据验证表达式，类型参考type选项

*  `constructor` *Objcte* - 自定义数据导出构造方法（可选）

## 输出

*  `error` *String* - 验证失败时返回的错误信息，验证成功时返回null

*  `data` *Objcte* - 经过验证、处理后导出数据（支持空值过滤，用于剔除对象中的空数组、空字符串、undefind、null）

*  `${name}` *Objcte* - 由constructor对象中构造器生成的对象，命名与构造器名称一致（空值过滤）


## 选项说明

> 如果只想验证数据类型，可以直接在参数值上用数据类型赋值，可参考示例中search参数

### 通用选项

* `type` * - 用于定义数据类型，可选类型有String、Number、Object、 Array、Date、Boolean、"ObjectId"、"MobilePhone"，带引号字符串表示扩展类型（必选）

* `name` *String* - 自定义参数名称，用于错误返回值中替换默认参数名

* `default` * - 空值时的默认赋值

* `value` * - 直接通过表达式赋值，类似于default选项，区别是不管值是否为空都将使用该值覆盖（优先级低于default，目前没有发现同时使用的应用场景）

* `allowNull` *Boolean* - 是否允许为空，默认为true

* `and` *Array、Function* - 声明依赖的参数名数组，支持数组和函数两种表达式，函数表达式用于声明指定值的依赖关系。要求依赖的所有参数都不能为空

* `or` *Array、Function* - 与and相似，区别是只要求依赖的其中一个参数不为空即可

* `method` *Function* - 参数自定义转换方法，非空值时执行


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

> 目前仅支持类型验证


### 扩展类型（用字符串表示）

#### 'ObjectId'

> 验证mongodb中的ObjectId

#### 'MobilePhone'

> 验证手机号

#### 'Email'

> 验证Email

## 验证示例

#### 输入数据

      let data = {
         "username": "测试",
         "tenderNum": "123456789987",
         "time": "2017-07-07T09:53:30.000Z",
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
         "keys": {
               a: "1",
               b: 2,
               c: 666,
               d: 4,
         }
      }

#### 验证表达式

      let { error, data, filter } = Validator(data,
         {
            "username": {
               "type": String,
               "name": "用户名",
               "allowNull": false
            },
            "tenderNum": String,
            "time": {
               "type": Date,
               "name": "时间",
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
               "value": "直接通过表达式赋值"
            },
            "search": String,
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
               "type": 'Email',
            },
            "keys": {
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

## 数组验证

      let { error, data } = Validator(["a.js", "b.js", "c.js"], [String])


## 具有相同数据结构、类型的复用验证表达式

      let { error, data } = Validator({
         "a": false,
         "b": false,
         "c": true,
         "d": true,
         "e": false,
         "f": true,
         "g": true,
      }, {
         $: {
            type: Boolean,
         }
      })


## 扩展数据类型验证

      let { error, data } = Validator({
         "id": "5968d3b4956fe04299ea5c18",
         "mobilePhone": "18555555555",
      }, {
         "id": "ObjectId",
         "mobilePhone": "MobilePhone"
      })

## and

      let { error, data } = Validator({
         "username": "莉莉",
         "addressee": "嘟嘟",
      }, {
         "username": {
            "type": String,
            // 使用数组表达式
            "and": ["addressee", "address"],
         },
         "addressee": {
            "type": String,
            "allowNull": true
         },
         "address": {
            "type": String,
            "allowNull": true,
            // 使用函数表达式，表示特定值的依赖关系
            and(value){
               if (value === 1) {
                  return ["addressee", "address"]
               } else if (value === 2) {
                  return ["username", "xx"]
               }
            },
         }
      })

## or

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