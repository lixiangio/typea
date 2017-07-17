# 数据验证器

## 使用方法

      Verify(data, options)

*  `data` *Objcte* - 验证数据

*  `options` *Objcte* - 验证数据表达式

## 使用示例

#### 验证数据

      {
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
            "allowNull": true
         }],
         "email": {
            "type": String,
            "allowNull": true
         }
      })


## 具有相同数据结构的复用验证表达式

#### 验证数据

      {
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

		$: {
			type: Boolean,
			allowNull: true,
		}