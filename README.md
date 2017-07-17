## 使用方法

    let verify = Verify(data, options)

*  `data` *Objcte* - 验证数据

*  `options` *Objcte* - 验证数据表达式

## 导出验证结果

*  `verify.error` *String* - 错误信息

*  `verify.data` *Objcte* - 验证数据

*  `verify.group` *Objcte* - 数据分组


## 使用示例

#### 验证数据

      let data = {
         "name": "测试",
         "time": "2017-07-07T09:53:30.000Z",
         "companyName": ["a.js", "b.js", "c.js"],
         "multiple": ["a", "b", "c", "d"],
         "money": 555,
         "multiple": "莉莉",
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
            "group": "filter",
         }],
         "email": {
            "type": String,
            "allowNull": true,
            "group": "filter",
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