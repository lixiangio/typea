# typea

功能强大的 JS 运行时数据验证与转换器，使用全镜像的对称数据结构模型，轻量级、简单、直观、易于读写。

Typea 中的很多类型概念引用自 TypeScript，相关概念请参考 [TypeScript 文档](https://www.typescriptlang.org/docs/)。

### 特性

- 支持 string、number、boolean、object、array、function、symbol、null、undefined、any 等常见基础类型；

- 支持 [Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) 元组类型，为数组内的每个子元素提供精确的差异化类型匹配；

- 支持在 Array / Tuple 结构体中使用 [ ...type ] 扩展运算符语法定义类型，匹配零个或多个连续的同类型元素；

- 支持在 Object 结构体中使用 { ...type } 扩展运算符语法定义类型，匹配零个或多个同类型的可选属性；

- 支持 [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) 联合类型，匹配多个类型声明中的一个；

- 支持 [partial(type)](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)、[required(type)](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)、[pick(type, key)](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)、[omit(type, key)](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) 类型转换函数；

- 支持 [Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) 字面量赋值匹配，可满足模糊匹配与精准匹配的双重需求；

- 支持 [Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties) 可选属性，使用 optional( type ) 函数代替 TS 的 name? 属性修饰符；

- 支持 [Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) 索引签名，使用 [ $index ] 为动态属性添加类型约束；

- 支持对象、数组递归验证，只需要按数据结构建模即可，不必担心数据层级深度问题；

- 支持数据就近、集中处理，减少碎片化代码，通过分布在节点上的 set 方法可合成新的数据结构；

- 对象属性命名安全、无冲突，模型中的所有类型声明均使用唯一的 symbol 类型标识，没有类似 type 的特殊保留关键字；

- 拥有足够的容错能力，在验证期间通常不需要使用 try/catch 来捕获异常，返回的 path 路径信息可快速定位错误节点；

- 轻量级、支持按需扩展自定义数据类型，实现最小化集成。

### Example

```js
import { Schema, createType, object, number, string, boolean } from "typea";
import { union, partial } from "typea/utility";

// 按需添加扩展类型
import Email from "typea/email.js";
import MobilePhone from "typea/mobilePhone.js";

const email = createType("email", Email);
const mobilePhone = createType("mobilePhone", MobilePhone);

// 创建镜像数据模型

const category = object({
  id: number,
  name: string
});

const categorys = [...category]; // 包含多个 category 的数组

category.childs = categorys; // 循环引用，递归验证 (注意！如果验证数据中也同样存在循环引用，会导致无限循环)

const schema = new Schema({
  id: number,
  name: string,
  email,
  mobilePhone,
  categorys,
  union: union(number, "hello", null, [...number], undefined), // Union 联合类型
  url: [string], // 单次匹配
  link: [...string], // 连续的零次或多次匹配，类似于 TS 中的 string[]
  list: [string, ...string], // 一次或多次 string 子匹配
  array: [...number, boolean], // 多类型扩展匹配
  tuple: [string, Number, { name: string }, function () { }, () => { }], // 多类型固定匹配
  user: {
    username: "莉莉", // Literal 字面量
    age: number({ max: 200 }),
    address: optional([{ city: String }, { city: "母鸡" }]),
  },
  map: { ...number },
  methods: {
    open() { }, // func 类型
  },
  description: string({ optional: true }), // 可选属性
  ...string, // 索引签名，扩展后赋值为 { [indexKey]: string }，作用等同于 TS 类型声明 [name: string]: string
});

// 使用数据模型校验数据

const { error, value } = schema.verify({
  id: 123,
  name: "test",
  email: "gmail@gmail.com",
  mobilePhone: "18666666666",
  union: 100,
  url: ["https://github.com/"],
  list: ["a", "b", "c"],
  link: ["https://github.com/", "https://www.google.com/"],
  array: [1, 6, 8, 12, true],
  categorys: [
    {
      id: 1,
      name: "dog",
      childs: [
        {
          id: 13,
          name: "d2",
          childs: [
            {
              id: 12,
              name: "lili",
              childs: [],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "cat",
      childs: [],
    },
  ],
  tuple: [
    "hello word",
    123,
    { name: "lili" },
    function (v) {
      return v++;
    },
    () => { },
  ],
  title: "hello",
  user: {
    username: "莉莉",
    age: 99,
    address: [{ city: "黑猫" }, { city: "母鸡" }],
  },
  map: {
    a: 123,
    b: 456,
    c: 1000,
  },
  methods: {
    open(v) {
      return v + 1;
    },
  },
  string1: "s1",
  string2: "s2",
  string3: "s3",
});

if (error) {
  console.error(error);
} else {
  console.log(value);
}
```

### Install

```
npm install typea
```

### 类型

基础类型大小写兼容（推荐使用小写类型），如类型声明 string、string() 、String 等效，扩展类型不支持大小写混用。

大写不需要通过声明就可以直接使用，好处是使用方便，缺点是不支持传参，仅适用于简单的基础类型声明。

小写的好处是可以通过函数传参的方式，添加更丰富的类型扩展选项，实现更高级的数据校验功能。

### 模型

模型是可复用的静态类型结构体，通常只需要创建一次即可，作用与 TS 中的 interface、 type 相似。

### 输入参数

- `node` _any_ - 数据结构镜像表达式；

- `data`_any_ - 待验证的数据，支持任意数据类型；

### 返回值

> 返回值是基于约定的对象结构，error 和 data 属性不会同时存在，验证成功返回 data，验证失败返回 error 和 msg

- `data`_any_ - 经过验证、处理后导出数据，仅保留 options 中定义的数据结构，未定义的部分会被忽略。内置空值过滤，自动剔除对象、数组中的空字符串、undefind 值。

- `error` _string_ - 验证失败时返回的错误信息，包含错误的具体位置信息，仅供开发者调试使用

<!-- - `msg` _string_ - 验证失败后返回的错误信息，相对于 error 而言，msg 对用户更加友好，可直接在客户端显示 -->

#### 类型函数的通用选项

- `optional` _boolean_ - 可选属性，当值为 true 时允许存在未定义属性。

- `default`_any_ - 属性不存在时填充默认值，在使用 default 时，optional 会自动设为 true。

- `set` _function_ - 赋值函数，用于对输入值处理后再输出赋值，函数中 this 指向原始数据 data。使用 set 时， optional 会自动设为 true。

#### 专用选项

> 针对不同的数据类型，会有不同的可选参数，选项如下

##### string

- `min` _number_ - 限制字符串最小长度

- `max` _number_ - 限制字符串最大长度

- `reg` _RegExp_ - 正则表达式

- `in` _string[]_ - 匹配多个可选值中的一个

##### number

> 内置类型转换，允许字符串类型的纯数字

- `min` _number_ - 限制最小值

- `max` _number_ - 限制最大值

- `in` _number[]_ - 匹配多个可选值中的一个

##### array

- `min` _number_ - 限制数组最小长度

- `max` _number_ - 限制数组最大长度

<!-- ##### object、date、boolean、function

> 无专用选项 -->

#### 附加常见数据类型

typea 库中包含了以下常见类型，默认不引用，推荐按需扩展。

```js
import { createType } from "typea";
import date from "typea/date.js";
import email from "typea/email.js";
import mobilePhone from "typea/mobilePhone.js";
import mongoId from "typea/mongoId.js";

createType(date.name, date);
createType(email.name, email);
createType(mobilePhone.name, mobilePhone);
createType(mongoId.name, mongoId);
```

##### email

验证 email

##### mobilePhone

验证手机号

##### mongoId

验证 mongodb 中的 ObjectId

### 自定义数据类型

typea 中仅内置了少量常见的数据类型，如果不能满足需求，可以通过 createType 方法搭配 validator 等第三方库自行扩展。

> 当定义的数据类型已存在时则合并，新的验证函数会覆盖内置的同名验证函数。

#### createType(name, options)

- `name` _function, symbol, string_ - 类型名称（必选）

- `options` _object_ - 类型选项（必填）

  - `type(data, options)` _function_ - 数据类型验证函数（必选）

    - `data` _any_ - 待验证数据

    - `options` _any_ - 验证表达式或数据类型

  - `[$name](data, options)` _function_ - 自定义验证函数（可选）

```js
createType("int", {
  type(data) {
    if (Number.isInteger(data)) {
      return { data };
    } else {
      return { error: "必须为 int 类型" };
    }
  },
  min(data, min) {
    if (data < min) {
      return { error: `不能小于${min}` };
    } else {
      return { data };
    }
  },
});
```

### 参考示例

```js
// 数组验证

import { Schema, string, number  } from "typea";

const numberAllowNull = number({ optional: true });

const schema = new Schema({
  a: [string],
  b: [numberAllowNull],
  c: [{ a: Number, b: Number }],
  d: [
    {
      d1: 666,
      d2: string,
    },
    Number,
    [
      {
        xa: Number,
        xb: [numberAllowNull],
      },
    ],
    String,
  ],
  e: Array,
});

const { error, value } = schema.verify({
  a: ["dog", "cat"],
  b: [123, 456, 789],
  c: [{ a: 1 }, { a: 2 }, { b: "3" }],
  d: [
    {
      d1: 666,
      d2: "888",
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
      },
    ],
    "hello",
  ],
  e: [1, 2, 3],
});
```

```js
// 对象验证

const sample = {
  a: {
    a1: 1,
    a2: 12,
  },
  b: 99,
  f(a, b) {
    return a + b;
  },
};

import { Schema, number } from "typea";

const { error, value } = new Schema({
  a: {
    a1: number({ optional: true }),
    a2: 12,
  },
  b: 99,
  f(func, set) {
    set(func(1, 1));
  },
}).verify(sample);
```

```js
// 扩展数据类型

import { Schema, createType } from "typea";

const int = createType("int", {
  type(data) {
    if (Number.isInteger(data)) {
      return { data };
    } else {
      return { error: "必须为 int 类型" };
    }
  },
});

const { error, value } = new Schema({ age: int }).verify({ age: 20 });
```
