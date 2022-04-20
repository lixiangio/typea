# typea

功能强大的 JS 运行时数据验证与转换器，使用全镜像的对称数据结构模型，简单、直观、易于读写。

Typea 中的很多类型概念引用自 TypeScript，相关概念请参考 [TypeScript 文档](https://www.typescriptlang.org/docs/)。

### 特性

- 支持 string、number、boolean、object、array、function、symbol、any 等常见基础类型；

- 支持 [Tupl Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) 元组类型，为数组内的每个子元素提供精确的差异化类型匹配；

- 支持在 Array / Tupl 中使用 (...) 扩展运算符，匹配零个或多个连续的同类型元素；

- 支持 [Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties) 可选属性，Typea 中使用 optional(type) 函数代替 TypeScript 的 "name?" 属性修饰符；

- 支持 [Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) 索引签名，为无固定名称的属性统一定义类型；

- 支持 [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) 联合类型，匹配多个类型声明中的一个；

- 支持 [partial(type)](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)、[required(type)](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)、[pick(type, key)](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)、[omit(type, key)](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) 类型转换函数；

- 支持 [Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) 字面量类型赋值匹配，可满足模糊匹配与精准匹配的双重需求；

- 支持对象、数组递归验证，只需要按数据结构建模即可，不必担心数据层级深度问题；

- 支持数据就近、集中处理，减少碎片化代码，通过分布在节点上的 set 方法可合成新的数据结构；

- 拥有足够的容错能力，在验证期间通常不需要使用 try/catch 来捕获异常，返回的 path 路径信息可快速定位错误节点；

- 支持按需扩展自定义数据类型，实现最小化集成。

### Install

```
npm install typea
```

### Examples

```js
import types from "typea";

// 根据需求，添加扩展类型
import email from "typea/type/email.js";
import mobilePhone from "typea/type/mobilePhone.js";

types.add(email.name, email);
types.add(mobilePhone.name, mobilePhone);

// 创建一个简单的自定义 int 类型
types.add("int", {
  type(data) {
    if (Number.isInteger(data)) {
      return { data };
    } else {
      return { error: "值必须为 int 类型" };
    }
  },
  max(data, max) {
    if (data > max) {
      return { error: `值不能大于${max}` };
    } else {
      return { data };
    }
  },
});
```

```js
import types from "typea";
import { optional, union, partial } from "typea/utility";

// 创建 schema 并使用 schema 验证数据
const { string, number, boolean, email, mobilePhone, int, $string } = types;

// 创建数据模型
const schema = types({
  id: Number,
  name: string,
  email,
  mobilePhone,
  num: union(String, Number, 'abc', null, [], undefined), // Union 联合类型
  list: [...String], // 类似于 TS 的 string[]
  array: [...number, boolean], // 扩展运算符与混合类型声明
  link: [String], // 匹配只包含单个子元素的元组
  tuple: [String, Number, { name: String }, () => {}, function () {}], // 匹配包含多个不同类型子元素的元组
  user: partial({
    username: "莉莉", // Literal 字面量
    age: int({ max: 200 }),
    address: optional([{ city: String }, { city: "母鸡" }]),
  }),
  methods: {
    open() {}, // Function 类型
  },
  title: optional("hello"), // 可选属性
  [$string]: String, // 索引类型
});

const { error, data } = schema.verify({
  id: 123,
  name: "test",
  email: "gmail@gmail.com",
  mobilePhone: "18666666666",
  num: 12345,
  list: ["a", "b", "c"],
  array: [1, 6, 8, 12, true],
  link: ["https://github.com/"],
  tuple: [
    "hello word",
    123,
    { name: "lili" },
    () => {},
    function (v) {
      return v++;
    },
  ],
  title: "hello",
  user: {
    username: "莉莉",
    age: 99,
    address: [{ city: "黑猫" }, { city: "母鸡" }],
  },
  methods: {
    open(v) {
      return v + 1;
    },
  },
});

if (error) {
  console.error(error);
} else {
  console.log(data);
}
```


### 类型

基础类型大小写兼容（推荐使用小写类型），如类型声明 string、string() 、String 等效。扩展类型不支持大小写混用。

大写不需要通过声明就可以直接使用，好处是使用方便，缺点是不支持传参,仅适用于声明简单的基础数据类型。

小写的好处是可以通过函数传参的方式，添加更丰富的类型描述信息，实现更高级的数据校验功能。

### 模型

模型通常是可复用的静态类型结构体，只需要创建一次即可，作用与 TS 中的 interface、 type 相似。

### 输入参数

- `express` _any_ - 待验证的数据结构镜像表达式；

- `data`_any_ - 需要验证的数据，支持任意数据类型；

### 返回值

> 返回值是基于约定的对象结构，error 和 data 属性不会同时存在，验证成功返回 data，验证失败返回 error 和 msg

- `data`_any_ - 经过验证、处理后导出数据，仅保留 options 中定义的数据结构，未定义的部分会被忽略。内置空值过滤，自动剔除对象、数组中的空字符串、undefind 值。

- `error` _string_ - 验证失败时返回的错误信息，包含错误的具体位置信息，仅供开发者调试使用

<!-- - `msg` _string_ - 验证失败后返回的错误信息，相对于 error 而言，msg 对用户更加友好，可直接在客户端显示 -->

#### 类型函数的通用选项

- `partial` _boolean_ - 可选属性，当值为 true 时允许存在未定义属性。

- `default`_any_ - 属性不存在时填充默认值，在使用 default 时，partial 会自动设为 true

- `set` _function_ - 赋值函数，用于对输入值处理后再输出赋值，函数中 this 指向原始数据 data。使用 set 时， partial 会自动设为 true。

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

typea 仓库中包含了以下常见类型，默认不安装，推荐按需引用。

```js
import types from "typea";
import date from "typea/date.js";
import email from "typea/email.js";
import mobilePhone from "typea/mobilePhone.js";
import mongoId from "typea/mongoId.js";

types.add(date.name, date);
types.add(email.name, email);
types.add(mobilePhone.name, mobilePhone);
types.add(mongoId.name, mongoId);
```

##### email

验证 email

##### mobilePhone

验证手机号

##### mongoId

验证 mongodb 中的 ObjectId

### 自定义数据类型

typea 中仅内置了少量常见的数据类型，如果不能满足需求，可以通过 types.add() 方法搭配 validator 等第三方库自行扩展。

> 当定义的数据类型已存在时则合并，新的验证函数会覆盖内置的同名验证函数。

#### types.add(name, options)

- `name` _function, symbol, string_ - 类型 Key（必选）

- `options` _object_ - 类型选项（必填）

  - `type(data, options)` _function_ - 数据类型验证函数（必选）

    - `data` _any_ - 待验证数据

    - `options` _any_ - 验证表达式或数据类型

  - `[$name](data, options)` _function_ - 自定义验证函数（可选）

```js
types.add("int", {
  type(data) {
    if (Number.isInteger(data)) {
      return { data };
    } else {
      return { error: "必须为 int 类型" };
    }
  },
  max(data, max) {
    if (data > max) {
      return { error: `不能大于${max}` };
    } else {
      return { data };
    }
  },
});
```

### 参考示例

```js
// 数组验证

const sample = {
  a: ["xx", "kk"],
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
};

const { string, number } = types;

const numberAllowNull = number({ partial: true });

const { error, data } = types(sample).verify({
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

const { number } = types;

const { error, data } = types(sample).verify({
  a: {
    a1: number({ partial: true }),
    a2: 12,
  },
  b: 99,
  f(func, set) {
    set(func(1, 1));
  },
});
```

```js
// 扩展数据类型

types.add("int", {
  type(data) {
    if (Number.isInteger(data)) {
      return { data };
    } else {
      return { error: "必须为 int 类型" };
    }
  },
});

const { int } = types;

const { error, data } = types({ age: int }).verify({ age: 20 });
```

```js
// 综合示例

const sample = {
  name: "测试",
  num: "123456789987",
  ObjectId: "59c8aea808deec3fc8da56b6",
  files: ["abc.js", "334", "null", "666", "12"],
  user: {
    username: "莉莉",
    age: 18,
    address: [
      {
        city: "双鸭山",
      },
      {
        city: "巴萨",
      },
    ],
  },
  list: [
    {
      username: "吖吖",
      age: {
        kk: [{ kkk: 666 }],
      },
    },
    {
      username: "可可",
      age: {
        kk: [{ kkk: 666 }, { kkk: 999 }],
      },
    },
  ],
  money: "2",
  guaranteeFormat: 0,
  addressee: "嘟嘟",
  phone: "18565799072",
  coupon: "uuuu",
  integral: {
    lala: "168",
    kaka: 6,
  },
  search: "双鸭山",
  searchField: "userName",
  email: "xxx@xx.xx",
  arr: ["jjsd", "ddd"],
};

const { string, number, email, mobilePhone } = types;

const { error, data } = types({
  name: string({
    name: "名称",
    partial: true,
    default: "默认值",
  }),
  num: number({ value: 666 }),
  user: {
    username: "莉莉",
    age: Number,
    address: [
      {
        city: String,
      },
      {
        city: "巴萨",
      },
    ],
  },
  list: [
    {
      username: String,
      age: {
        kk: [{ kkk: Number }],
      },
    },
  ],
  money: number({
    min: 1,
    in: [1, 2],
  }),
  files: [number({ partial: true })],
  guaranteeFormat: number,
  addressee: String,
  search: "双鸭山",
  phone: mobilePhone,
  coupon: string({
    set($gt) { return { $gt }; },
  }),
  integral: {
    lala: Number,
    kaka: number({
      partial: true,
      in: [1, 3, 8, 6],
    },
  }),
  email: email({
    set(value) {
      return [value, , null, , undefined, 666];
    },
  }),
  arr: [String],
}).verify(sample);
```
