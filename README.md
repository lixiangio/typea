### Installation

      npm install check-data --save

### 使用方法

    let Validator = require('check-data')
    
    let { error, data } = Validator(data, options, customize)

### 输入

*  `data` *Objcte, Array, String, Number, Date, Boolean* - 输入待验证数据

*  `options` *Objcte, Array, Function* - 数据验证表达式，类型参考type选项

*  `customize` *Objcte* - 自定义数据构建对象，用于添加自定义数据结构（可选）

*  `customize.$` *Function* - 自定义数据构建方法，使用验证后的数据创建新的数据结构，this和函数第一个参数指向已验证数据。该函数返回值中支持多层内嵌函数表达式，用于动态生成返回值。

### 输出

*  `error` *String* - 验证失败时返回的错误信息，包含错误的具体位置信息，仅供开发者调试使用

*  `data` *Objcte* - 经过验证、处理后导出数据（带空值过滤，用于剔除对象中的空数组、空字符串、undefind、null等无效数据）

*  `msg` *String* - 验证失败后返回的错误信息，相对于error而言，msg对用户更加友好，可直接在客户端显示


### options - 公共选项

* `type` *String, Number, Object, Array, Date, Boolean, "MongoId", "MobilePhone", 'Email'* - 数据类型，扩展类型用字符串表示

* `name` *String* - 自定义参数名称，用于错误返回值中替换默认参数名

* `default` * - 默认赋值

* `value` * - 直接通过表达式赋值，类似于default选项，区别是不管值是否为空都将使用该值覆盖（优先级低于default，目前没有发现同时使用的应用场景）

* `allowNull` *Boolean* - 是否允许为空，默认为true

* `and` *Array、Function* - 声明依赖的参数名数组，支持数组和函数两种表达式，函数表达式用于声明指定值的依赖关系。要求依赖的所有参数都不能为空

* `or` *Array、Function* - 与and相似，区别是只要求依赖的其中一个参数不为空即可

* `method` *Function* - 参数自定义转换方法，非空值时执行


### options - 针对指定数据类型的私有选项

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

#### Array

* `minLength` *Number* - 限制字符串最小长度

* `maxLength` *Number* - 限制字符串最大长度

#### Object

> 仅支持类型验证

#### Date、Boolean

> 仅支持类型验证


### 扩展类型

#### 'MongoId'

> 验证mongodb中的ObjectId

#### 'MobilePhone'

> 验证手机号

#### 'Email'

> 验证Email


### 自定义扩展

   使用Validator.use(typename, options)


### 数组验证

      let { error, data } = Validator(["a", "b", "c"], [String])

      let { error, data } = Validator([{
         "a":1,
         "b":"bibi",
         "c":"test"
      },{
         "a":1,
         "b":"bibi",
         "c":"test"
      }], [{
         a: Number,
         b: String,
         c: String
      }])


### 对象验证

      let { error, data } = Validator({
         "a": 1,
         "b": "xx",
         "c": [1,32,34],
         "d": 666
      }, {
         "a": Number,
         "b": String,
         "c": [String],
         "d": Number
      })


### and验证

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

### or验证

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


### 扩展类型验证

      let { error, data } = Validator({
         "id": "5968d3b4956fe04299ea5c18",
         "mobilePhone": "18555555555",
      }, {
         "id": "MongoId",
         "mobilePhone": "MobilePhone"
      })
      
### 自定义类型

      Validator.use('Int', {
         type({ data }) {
            if (Number.isInteger(data)) {
               return { data }
            } else {
               return { err: '必须为Int类型' }
            }
         },
      })

### 实例

      # 输入数据
      let json = {
         "username": "测试",
         "tenderNum": "123456789987",
         "time": "2017-07-07T09:53:30.000Z",
         "files": ["abc.js", "334", "null", "666", , , "kkk.js"],
         "user": {
            "username": "莉莉",
            "age": 18,
         },
         "list": [
            {
               "username": "吖吖",
               "age": 16,
            },
            {
               "username": "可可",
               "age": 15,
            }
         ],
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
         "email": "xxx@xx.xx"
      }

      # 验证表达式
      let { error, data } = Validator(json,
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
            "user": {
               "username": String,
               "age": Number,
            },
            "list": [{
               "username": String,
               "age": Number,
            }],
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
         },
         {
            filter({ search, email, integral }) {
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
