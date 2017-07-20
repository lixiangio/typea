## Installation

      npm install check-data --save


## 使用方法

    let verify = Verify(data, options)

*  `data` *Objcte* - 验证数据

*  `options` *Objcte* - 验证数据表达式

## 导出验证结果

*  `verify.error` *String* - 错误信息

*  `verify.data` *Objcte* - 验证数据


## 使用示例

#### 验证数据

      let data = {
         "name": "测试",
         "time": "2017-07-07T09:53:30.000Z",
         "companyName": ["a.js", "b.js", "c.js"],
         "multiple": ["a", "b", "c", "d"],
         "money": 555,
         "email": "abc@gmail.com"
      }

#### 验证器表达式

      let verify = Verify(data, {
         "name": String,
         "time": Date,
         "companyName": [String],
         "money": Number,
         "multiple": [{
            "type": String,
            "allowNull": true,
            "export": "filter",
         }],
         "email": {
            "type": String,
            "allowNull": true,
            "export": "filter",
         }
      })


## 同构数据可复用验证表达式

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

#### 验证器表达式

      let verify = Verify(data, {
         $: {
            type: Boolean,
            allowNull: true,
         }
      })


## 数组验证

#### 验证数据

      let data = ["a.js", "b.js", "c.js"]

#### 验证器表达式

      let verify = Verify(data, [String])


## Number转Boolean

#### 验证数据

      let data = {
         "a": 0,
         "b": 3,
      }

#### 验证器表达式

      let verify = Verify(data, {
         a: {
            "type": Number,
            "conversion": Boolean
         },
         b: {
            "type": Number,
            "conversion": Boolean
         }
      })

      // Returns {a:false, b:true}


## 自定义类型

#### 验证数据

      let data = {
         "id": "5968d3b4956fe04299ea5c18",
         "mobilePhone": "18555555555"
      }

#### 验证器表达式

      let verify = Verify(data, {
         "id": "ObjectId",
         "mobilePhone": "MobilePhone"
      })


## 关联验证

#### 验证数据

      let data = {
         "username": "莉莉",
         "addressee": "嘟嘟",
      }

#### 验证器表达式

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