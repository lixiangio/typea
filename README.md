# typea

功能强大的轻量级 JS 运行时数据类型验证与转换器，使用全镜像数据结构设计，简单、直观、易于读写。

### 特性

- 支持字符串、数值、对象、数组、元组、函数等常见基础类型；

- 支持赋值验证，满足模糊匹配与精准匹配的双重需求；
- 支持对象、数组递归匹配，只需要按数据结构建模即可，不必担心数据层级深度、复杂度等问题；

- 通过分布在节点上的 set 方法可合成新的数据结构，实现数据集中处理，减少碎片化代码；

- 拥有足够的容错能力，在验证阶段几乎不需要使用 try/catch 来捕获异常，返回的 path 路径信息可快速定位错误节点；

- 支持按需扩展自定义数据类型，实现最小化集成。

### Install

```
npm install typea
```

### Examples

```js
// 根据需求，添加扩展数据类型，或创建自定义数据类型

import types from "typea";
import email from "typea/email.js";
import mobilePhone from "typea/mobilePhone.js";

types.type(email.name, email);
types.type(mobilePhone.name, mobilePhone);

// 自定义类型
types.type("int", {
  type(data) {
    if (Number.isInteger(data)) {
      return { data };
    } else {
      return { error: "必须为int类型" };
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

```js
import types from 'typea';

const { email, mobilePhone, int } = types; // 已注册的扩展类型

// 创建数据模型（模型结构通常是可重复使用静态结构，只需要创建一次即可，每次都创建新的 schema 通常没有意义）
const schema = types({
  id: Number,
  name: String,
  email,
  mobilePhone,
  num: Number,
  array: [String],
  tuple: [String, Number, ()=> {}, function() {}, { name: String }],
  title: "hello",
  user: {
    username: "莉莉",
    age: {
      type: int,
      max: 200
    },
    address: [
      { city: String },
      { city: "母鸡" }
    ],
  },
  methods: {
    open() {},
    close() {},
  },
});

const { error, data } = schema.verify({
  id: 123,
  name: "test",
  email: "gmail@gmail.com",
  mobilePhone: "18666666666",
  num: 12345,
  array: ["a", "b", "c"],
  tuple: ["hello", 123, ()=> {}, function(v) { return v++; }, { name: 'lili' }],
  title: "hello",
  user: {
    username: "莉莉",
    age: 99,
    address: [
      { city: "黑猫" },
      { city: "母鸡" }
    ],
  },
  methods: {
    open(v) { return v + 1; },
    close(v) { return v - 1; },
  },
});

if (error) {
  console.error(error);
} else {
  console.log(data);
}
```

### 验证模式

typea 支持常规、严格、宽松三种验证模式，多数情况下只需要使用常规模式即可。

> 引入严格模式和宽松模式的主要原因是为了弥补 js 对象结构对自身的表达存在分歧，当数组或对象结构中包含子表达式时没有额外的结构来定义空值。

#### 常规模式

常规模式下默认只对 allowNull 为 false 的节点强制执行非空验证，默认对包含子表达式的数组、对象结构体执行强制非空验证。

```js
const schema = types(express);

const { error, data } = schema.verify(data[, extend])
```

#### 严格模式

严格模式下默认会为所有节点强制执行非空验证，除非明确声明 allowNull 为 true。

```js
const schema = types(express);

const { error, data } = schema.strictVerify(data[, extend])
```

#### 宽松模式

宽松模式下不会对包含子表达式的数组、对象结构体进行强制非空验证。

```js
const schema = types(express);

const { error, data } = schema.looseVerify(data[, extend])
```

### 输入参数

- `express` _any_ - 待验证数据的结构镜像验证表达式，参考[验证表达式](#模型验证表达式)。

- `extend` _objcte_ - 数据结构扩展选项，根据输入数据生成新的数据结构（可选）

  - `$name` _function_ - 数据扩展函数，基于已验证的数据构建新的数据结构，输出结果将以函数名作为 key 保存到返回值的 data 中。函数中 this 和第一个入参指向 data（已存在的同名属性值会被函数返回值覆盖）

  - `$name`_any_ - 除函数外的其它任意数据类型，在已验证的数据结构上添加新的属性或覆盖已存在的同名属性

- `data`_any_ - 验证数据，支持任意数据类型

### 返回值

> 返回值是基于约定的对象结构，error 和 data 属性不会同时存在，验证成功返回 data，验证失败返回 error 和 msg

- `data`_any_ - 经过验证、处理后导出数据，仅保留 options 中定义的数据结构，未定义的部分会被忽略。内置空值过滤，自动剔除对象、数组中的空字符串、undefind 值。

- `error` _string_ - 验证失败时返回的错误信息，包含错误的具体位置信息，仅供开发者调试使用

- `msg` _string_ - 验证失败后返回的错误信息，相对于 error 而言，msg 对用户更加友好，可直接在客户端显示

### 模型验证表达式

options 数据验证表达式支持无限嵌套，不管你的数据层级有多深。

type 作为验证表达式的内部保留关键字，应尽量避免在入参中包含同名的 type 属性，否则可能导致验证结果出现混乱。

整体数据结构与待验证数据结构基本保持一致，除了使用 type 对象表达式不得不增加额外的数据结构。验证表达式中判断一个对象节点是否为验证选项的唯一依据是检查对象中是否包含 type 属性，如果没有 type 则被视为对象结构。

options 中支持值表达式，可以对表达式节点直接赋值，实现输入、输出的完全匹配或部分匹配，在用于对象模糊断言时非常有用。

当使用数组表达式时，需要区分单数和复数模式，单数时多个同级子节点会共用一个子表达式，通常用于验证具有相似数据结构的子集。复数时为精确匹配模式，可以完整定义每个子集。

#### 通用选项

- `type`_any_ - 数据类型

- `default`_any_ - 空值时的默认赋值，优先级高于 allowNull

- `allowNull` _boolean_ - 是否允许为空，当值为 false 时强制进行非空验证。

- `set` _function_ - 赋值函数，用于对输入值处理后再输出赋值，函数中 this 指向原始数据 data，当值为空时不执行。

- `ignore` _nay[]_ - 忽略指定的值，当存在匹配项时该字段不会被创建。如忽略空值，通过 [null, ""] 重新定义空值。

<!-- * `error` *String, Function* - 验证失败时的提示文本信息 -->

#### 专用选项

> 针对不同的数据类型，会有不同的可选参数，选项如下

##### String

- `min` _number_ - 限制字符串最小长度

- `max` _number_ - 限制字符串最大长度

- `reg` _RegExp_ - 正则表达式

- `in` _string[]_ - 匹配多个可选值中的一个

##### Number

> 内置类型转换，允许字符串类型的纯数字

- `min` _number_ - 限制最小值

- `max` _number_ - 限制最大值

- `in` _number[]_ - 匹配多个可选值中的一个

##### Array

- `min` _number_ - 限制数组最小长度

- `max` _number_ - 限制数组最大长度

##### Object、Date、Boolean、Function

> 无专用选项

#### 附加常见数据类型

typea 仓库中提供了以下常见类型，默认不安装，推荐按需引用。

```js
import types from "typea";
import date from "typea/date.js";
import email from "typea/email.js";
import mobilePhone from "typea/mobilePhone.js";
import mongoId from "typea/mongoId.js";

types.type(email.name, email);
types.type(date.name, date);
types.type(mobilePhone.name, mobilePhone);
types.type(mongoId.name, mongoId);
```

##### email

验证 email

##### mobilePhone

验证手机号

##### mongoId

验证 mongodb 中的 ObjectId

### 自定义数据类型

typea 中仅内置了少量常见的数据类型，如果不能满足需求，可以通过 types.type() 方法搭配 validator 等第三方库自行扩展。

> 当定义的数据类型已存在时则合并，新的验证函数会覆盖内置的同名验证函数。

#### types.type(name, options)

- `name` _function, symbol, string_ - 类型 Key（必填）

- `options` _object_ - 类型选项（必填）

  - `type(data, options)` _function_ - 数据类型验证函数（必填）

    - `data` _any_ - 待验证数据

    - `options` _any_ - 验证表达式或数据类型

  - `[$name](data, options)` _function_ - 自定义验证函数（可选）

```js
types.type("int", {
  type(data) {
    if (Number.isInteger(data)) {
      return { data };
    } else {
      return { error: "必须为int类型" };
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

const { error, data } = types(sample).verify({
  a: [String],
  b: [
    {
      type: Number,
      allowNull: false,
    },
  ],
  c: [{ a: Number, b: Number }],
  d: [
    {
      d1: 666,
      d2: String,
    },
    Number,
    [
      {
        xa: Number,
        xb: [
          {
            type: Number,
            allowNull: false,
          },
        ],
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

const { error, data } = types(sample).verify({
  a: {
    a1: {
      type: Number,
      allowNull: false,
    },
    a2: 12,
  },
  b: 99,
  f: {
    type: Function,
    set(func) {
      return func(1, 1);
    },
  },
});
```

```js
// 扩展数据类型

types.type("int", {
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

const { email, mobilePhone } = types;

const { error, data } = types(sample).verify(
  {
    name: {
      type: String,
      name: "名称",
      allowNull: false,
      default: "默认值",
    },
    num: {
      type: Number,
      value: 666,
    },
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
    money: {
      type: Number,
      min: 1,
      in: [1, 2],
    },
    files: [
      {
        type: String,
        allowNull: false,
      },
    ],
    guaranteeFormat: {
      type: Number,
      to: Boolean,
    },
    addressee: String,
    search: "双鸭山",
    phone: mobilePhone,
    coupon: {
      type: String,
      set($gt) {
        return { $gt };
      },
    },
    integral: {
      lala: {
        type: Number,
      },
      kaka: {
        type: Number,
        allowNull: false,
        in: [1, 3, 8, 6],
      },
    },
    email: {
      type: email,
      set(value) {
        return [value, , null, , undefined, 666];
      },
    },
    arr: [String],
  },
  {
    filter({ email, integral }) {
      return {
        email: email,
      };
    },
    where({ email, integral }) {
      return {
        integral: integral,
      };
    },
  }
);
```
