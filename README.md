# 数据验证器

## 使用方法

      Verify(data, options)

*  `data` *Objcte* - 验证数据

*  `options` *Objcte* - 验证数据表达式

## 使用示例

#### 验证数据


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


## 具有相同数据结构的复用验证

#### 验证器表达式

		$: {
			type: Boolean,
			allowNull: true,
		}