## 版本更新

## 3.0.1

* 新增Function类型验证

* 将handle函数名改为set

* 升级filter-null，取消递归自动执行嵌套函数

## 4.0.0

* 修改错误定位信息的显示格式 √ 

* 新增值类型验证 √

* 将验证类型由字符串声明方式改为引用声明，避免某些语义分歧 √

* Check.use()支持覆盖内置验证器 √

* 支持数组多键位精准匹配，单数表示通用匹配，复数表示精确匹配 √


## 4.0.1

* 取消Check.schema的name参数和内部引用，避免因为name同名，出现schema被覆盖的乱象。

* 修复错误定位信息中的显示路径错误

## 4.1.0

* 删除公用选项value

* 验证表达式中支持赋值全等表达式

* 新增严格模式Check.strict()方法

* 新增宽松模式Check.loose()方法

* schema新增严格模式schema.strict()方法

* schema新增宽松模式schema.loose()方法
