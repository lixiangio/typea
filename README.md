### Install

```
npm install check-data --save
```

### 使用方法

```js
let Check = require('check-data')

let { error, data } = Check(data, options, extend)
```

### 输入参数

*  `data` * - 待验证数据，允许任意数据类型

*  `options` * - 待验证数据的结构镜像验证表达式，参考[验证表达式](#验证表达式)。

*  `extend` *Objcte* - 数据扩展选项，根据输入数据生成新的数据结构（可选）

*  `extend.$name` *Function* - 数据扩展函数，基于已验证的数据构建新的数据结构，输出结果将以函数名作为key保存到返回值的data中。函数中this和第一个入参指向data（已存在的同名属性值会被函数返回值覆盖）

*  `extend.$name` * - 除函数外的其它任意数据类型，在已验证的数据结构上添加新的属性或覆盖已存在的同名属性

### 返回值

> 返回值是基于约定的对象结构，error和data属性不会同时存在，验证成功返回data，验证失败返回error和msg

*  `data` * - 经过验证、处理后导出数据，仅保留options中定义的数据结构，未定义的部分会被忽略。内置空值过滤，自动剔除对象、数组中的空字符串、undefind值。

*  `error` *String* - 验证失败时返回的错误信息，包含错误的具体位置信息，仅供开发者调试使用

*  `msg` *String* - 验证失败后返回的错误信息，相对于error而言，msg对用户更加友好，可直接在客户端显示

### 验证表达式

options数据验证表达式支持无限嵌套，不管你的数据层级有多深。整体数据结构与待验证数据结构基本保持一致，除了使用type对象表达式不得不增加额外的数据结构。

验证表达式中判断一个对象节点是否为验证选项的唯一依据是检查对象中是否包含type属性，如果没有type则被视为对象结构。

type作为验证表达式的内部保留关键字，应尽量避免在入参中包含同名的type属性，否则可能导致验证结果出现混乱。

当使用数组表达式时，需要区分单数和复数模式，单数时会共享同一个子表达式，通常用于验证具有相似结构的子集。复数时为精确匹配模式，可以完整定义每个子集。

#### 通用选项

* `type` * - 数据类型

* `default` * - 空值时的默认赋值

* `set` *Function* - 赋值函数，用于对输入值处理后再输出赋值，函数中this指向原始数据data，当值为空时不执行（原method方法）

* `value` * - 直接通过表达式赋值，类似于default选项，区别是不管值是否为空都将使用该值覆盖（优先级低于default，目前没有发现同时使用的应用场景）

* `allowNull` *Boolean* - 是否允许为空（默认将undefined和空字符串被视为空），缺省值为true。当值为false时，必须正确匹配指定的数据类型，否则会提示数据类型错误。

* `ignore` *Array* - 忽略指定的值，在字段级覆盖对默认空值的定义，如将某个指定字段的空值定义为[null, ""]

* `and` *Array、Function* - 声明依赖的参数名数组，支持数组和函数两种表达式，函数表达式用于声明指定值的依赖关系。要求依赖的所有参数都不能为空（注意：这里的and用于依赖判断，如参数a必须依赖参数b构成一个完整的数据，那么就要将参数b加入到and的数组中建立依赖关系）

* `or` *Array、Function* - 与and相似，区别是只要求依赖的其中一个参数不为空即可

* `name` *String* - 参数名称，为参数名定义一个更易于理解的别名，在返回错误描述文本中会优先使用该别名替换属性名

#### 专用选项

> 针对不同的数据类型，会有不同的可选参数，选项如下

##### String

* `minLength` *Number* - 限制字符串最小长度

* `maxLength` *Number* - 限制字符串最大长度

* `reg` *RegExp* - 正则表达式验证

* `in` *Array* - 匹配多个可选值中的一个

##### Number

> 内置类型转换，允许字符串类型的纯数字

* `min` *Number* - 限制最小值

* `max` *Number* - 限制最大值

* `in` *Array* - 匹配多个可选值中的一个

##### Array

* `minLength` *Number* - 限制数组最小长度

* `maxLength` *Number* - 限制数组最大长度

##### Object、Date、Boolean、Function

> 无专用选项


#### 其它数据类型

其它类型通过Check.types定义，types中内置了以下常见类型

##### email

验证Email

##### mobilePhone

验证手机号

##### mongoId

验证mongodb中的ObjectId


### 扩展自定义数据类型

验证器中仅内置了一部分常用的数据类型，如果不能满足你的需求，可以通过Check.use()自行扩展。

check-data依赖validator库，你可以使用Check.use()搭配validator来定制自己的数据类型。


> 当定义的数据类型不存在时则创建，已存在时则合并，新的验证函数会覆盖内置的同名验证函数。

```js
Check.use(name, options)
```

* `name` *Function, Symbol, String* - 类型Key（必填）

* `options` *Object* - 类型选项（必填）

* `options.type` *Function* - 数据类型验证函数（必填）

* `options.$name` *Function* - 自定义验证函数（可选）


```js
Check.use('int', {
   type({ data }) {
      if (Number.isInteger(data)) {
         return { data }
      } else {
         return { error: '必须为int类型' }
      }
   },
   max({ data, option: max }) {
      if (data > max) {
         return { error: `不能大于${max}` }
      } else {
         return { data }
      }
   },
   in({ data, option: arr }) {
      let result = arr.indexOf(data)
      if (result === -1) {
         return { error: `值必须为${arr}中的一个` }
      } else {
         return { data }
      }
   }
})
```

### schema验证器

schema用于创建可复用的验证器，在环境允许的情况下应优先使用schema模式。

> schema的定义应该在应用启动时被执行，而不是运行时。目的是通过预先缓存一部分静态数据，从而减少运行时的内存和计算开销。

```js
Check.schema(options, extend)
```

* `options` * - 验证表达式

* `extend` Object - 数据扩展选项

### 参考示例

#### schema验证

```js
let schema = Check.schema({
   a: {
      a1: {
         type: Number,
         allowNull: false
      },
      a2: {
         type: Number,
         allowNull: false
      }
   },
   b: Number,
})

let sample = {
   a: {
      a1: "jj",
      a2: "12",
   },
   b: 2,
   c: 888,
}

let { error, data } = schema(sample)
```

#### 数组验证

```js
let sample = {
   a: ['xx', 'kk'],
   b: [666, 999, 88,],
   c: [{ a: 1 }, { a: 2 }, { b: '3' }],
   d: [
      {
         d1: 666,
         d2: "888"
      },
      999,
      [
         {
            xa: 1,
            xb: [1, 2, 3],
         },
         {
            xa: 9,
            xb: [2, 4, 3],
         }
      ],
      "hello"
   ],
   e: [1, 2, 3],
}

let { error, data } = Check(sample, {
   a: [{ "type": String }],
   b: [{
      "type": Number,
      "allowNull": false
   }],
   c: [{ a: Number, b: Number }],
   d: [
      {
         d1: 666,
         d2: String
      },
      Number,
      [
         {
            xa: Number,
            xb: [{
               "type": Number,
               "allowNull": false
            }],
         }
      ],
      String
   ],
   e: Array
})
```

#### 对象验证

```js
let sample = {
   a: {
      a1: 1,
      a2: 12,
   },
   b: 99,
   f(a, b) {
      return a + b
   },
}

let { error, data } = Check(sample,
   {
      a: {
         a1: {
            type: Number,
            allowNull: false
         },
         a2: 12
      },
      b: 99,
      f: {
         type: Function,
         set(func) {
            return func(1, 1)
         }
      },
   }
)
```

#### and依赖验证

```js
let { error, data } = Check({
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
```

#### or依赖验证

```js
let { error, data } = Check({
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
```

#### 扩展类型验证

```js
let { mongoId, email, mobilePhone, int } = Check.types

let { error, data } = Check(
   {
      "id": "5968d3b4956fe04299ea5c18",
      "mobilePhone": "18555555555",
      "age": 20,
   }, 
   {
      "age": int,
      "id": mongoId,
      "mobilePhone": mobilePhone
   }
)
```

#### 混合示例

```js
// 输入数据
let sample = {
   "username": "测试",
   "num": "123456789987",
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

// 验证表达式
let { error, data } = Check(sample,
   {
      "username": {
         "type": String,
         "name": "用户名",
         "allowNull": false
      },
      "num": String,
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
         set(value) {
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
      filter({ email, integral }) {
         return {
            "email": email,
            "integral": integral,
            "test": {
               a: 1,
            },
         }
      },
      more({ email }) {
         return [email]
      },
      xxx: 1,
      yyy: 222
   }
)
```