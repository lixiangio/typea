## 版本更新

### 6.0.0

- 完善对 TypeScript 的支持
-
- 精简代码，移除 and() / or() 选项，用 set() 选项代替

- 将 typea.use() 改为 typea.type()

- 将 typea.types.$type 访问路径缩短为 typea.$type
- 移除核心代码中的 validator 类型验证库，改为以独立模块的方式按需引用验证类型

- 添加函数表达式语法，让函数类型声明更易于读写

### 4.4.5

- 将 types 由 Object 替换为 Map 类型

### 4.4.3

- 将代码从 CommonJS 切换到 ES6 模块，通过 rollup 转码

### 4.4.2

- 优化 validator 模块打包时大小，只装载实际使用的验证函数

### 4.4.1

- 取消验证表达式中的 name 参数，因为自动合成错误提示信息无法满足定制化需要

### 4.4.0

- 删除 filter-null 依赖，消除在循环引用数据结构下存在无限递归的 bug

### 4.2.0

- 取消 typea.use(options)的单对象传参方式，改用简化的函数多入口传参，方便使用动态化参数名
-

### 4.1.0

- 删除公用选项 value

- 验证表达式中支持赋值全等表达式

- 新增严格模式 typea.strict()方法

- 新增宽松模式 typea.loose()方法

- schema 新增严格模式 schema.strict()方法

- schema 新增宽松模式 schema.loose()方法
-

### 4.0.1

- 取消 typea.schema 的 name 参数和内部引用，避免因为 name 同名，出现 schema 被覆盖的乱象。

- 修复错误定位信息中的显示路径错误

### 4.0.0

- 修改错误定位信息的显示格式 √

- 新增值类型验证 √

- 将验证类型由字符串声明方式改为引用声明，避免某些语义分歧 √

- typea.use()支持覆盖内置验证器 √

- 支持数组多键位精准匹配，单数表示通用匹配，复数表示精确匹配 √

#### 3.0.1

- 新增 Function 类型验证

- 将 handle 函数名改为 set

- 升级 filter-null，取消递归自动执行嵌套函数
