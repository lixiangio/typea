import test from 'jtm';
import { createType, Schema, Utility, object, string, number, boolean } from "typea";
const { optional, union, partial } = Utility;
// 按需添加扩展类型
import Email from "typea/email.js";
import MobilePhone from "typea/mobilePhone.js";
const email = createType("email", Email);
const mobilePhone = createType("mobilePhone", MobilePhone);
// 创建一个简单的自定义 int 类型，限制其最大返回值
const int = createType("int", {
    type(data) {
        if (Number.isInteger(data)) {
            return { data };
        }
        else {
            return { error: "值必须为 int 类型" };
        }
    },
    max(data, max) {
        if (data > max) {
            return { error: `值不能大于"${max}"` };
        }
        else {
            return { data };
        }
    },
});
test('example', t => {
    // 创建镜像数据模型
    const category = object({
        id: number,
        name: string
    });
    const categorys = [...category];
    category.childs = categorys; // 建立循环引用，递归验证，注意!：如果验证数据中也同样存在循环引用，会导致无限循环
    const schema = new Schema({
        id: number,
        name: string,
        email,
        categorys,
        mobilePhone,
        union: union(number, "hello", null, [...number], undefined),
        url: [string],
        link: [...string],
        list: [string, ...string],
        array: [...number, boolean],
        tuple: [string, Number, { name: string }, function () { }, () => { }],
        user: partial({
            username: "莉莉",
            age: int({ max: 200 }),
            address: optional([{ city: String }, { city: "母鸡" }]),
        }),
        map: { ...number },
        methods: {
            open() { }, // func 类型
        },
        description: string({ optional: true }),
        ...string, // 索引签名，扩展赋值为 [indexKey]: string，作用等同于 TS 类型申明 [name: string]: string
    });
    // 使用数据模型校验数据
    const { error, data } = schema.verify({
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
    }
    else {
        t.ok(data);
    }
});
