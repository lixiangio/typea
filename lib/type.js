"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_js_1 = require("./common.js");
const symbol_js_1 = require("./symbol.js");
const toDate_js_1 = require("validator/lib/toDate.js");
const isMongoId_js_1 = require("validator/lib/isMongoId.js");
const isMobilePhone_js_1 = require("validator/lib/isMobilePhone.js");
const isEmail_js_1 = require("validator/lib/isEmail.js");
const types = new Map();
types.set(String, {
    ...common_js_1.default,
    // 数据类型验证
    type(data) {
        if (typeof data === 'string') {
            return { data: data.trim() };
        }
        else {
            return { error: '必须为String类型' };
        }
    },
    // 限制最小长度
    min(data, min) {
        if (data.length < min) {
            return { error: `长度不能小于${min}个字符` };
        }
        else {
            return { data };
        }
    },
    // 限制最大长度
    max(data, max) {
        if (data.length > max) {
            return { error: `长度不能大于${max}个字符` };
        }
        else {
            return { data };
        }
    },
    // 正则
    reg(data, reg) {
        if (data.search(reg) === -1) {
            return { error: '格式错误' };
        }
        else {
            return { data };
        }
    },
    // 包含
    in(data, array) {
        const result = array.indexOf(data);
        if (result === -1) {
            return { error: `值必须为[${array}]选项其中之一` };
        }
        else {
            return { data };
        }
    },
});
types.set(Number, {
    ...common_js_1.default,
    type(data) {
        if (isNaN(data)) {
            return { error: '必须为Number类型' };
        }
        else {
            return { data: Number(data) };
        }
    },
    min(data, min) {
        if (data < min) {
            return { error: `不能小于${min}` };
        }
        else {
            return { data };
        }
    },
    max(data, max) {
        if (data > max) {
            return { error: `不能大于${max}` };
        }
        else {
            return { data };
        }
    },
    // 包含
    in(data, array) {
        const result = array.indexOf(data);
        if (result === -1) {
            return { error: `值必须为${array}中的一个` };
        }
        else {
            return { data };
        }
    }
});
types.set(Array, {
    ...common_js_1.default,
    type(data) {
        if (Array.isArray(data)) {
            return { data };
        }
        else {
            return { error: '必须为Array类型' };
        }
    },
    min(data, min) {
        if (data.length < min) {
            return { error: `长度不能小于${min}个字符` };
        }
        else {
            return { data };
        }
    },
    max(data, max) {
        if (data.length > max) {
            return { error: `长度不能大于${max}个字符` };
        }
        else {
            return { data };
        }
    },
});
types.set(Object, {
    ...common_js_1.default,
    type(data) {
        if (typeof data === 'object') {
            return { data };
        }
        else {
            return { error: '必须为Object类型' };
        }
    },
});
types.set(Boolean, {
    ...common_js_1.default,
    type(data) {
        if (typeof data === 'boolean') {
            return { data };
        }
        else {
            return { error: '必须为Boolean类型' };
        }
    },
});
types.set(Date, {
    ...common_js_1.default,
    type(data) {
        if (toDate_js_1.default(data + '')) {
            return { data };
        }
        else {
            return { error: '必须为Date类型' };
        }
    },
});
types.set(Function, {
    ...common_js_1.default,
    type(data) {
        if (typeof data === 'function') {
            return { data };
        }
        else {
            return { error: '必须为Function类型' };
        }
    },
});
types.set(symbol_js_1.default.mongoId, {
    ...common_js_1.default,
    type(data) {
        if (isMongoId_js_1.default(String(data))) {
            return { data };
        }
        else {
            return { error: '必须为MongoId' };
        }
    },
});
types.set(symbol_js_1.default.mobilePhone, {
    ...common_js_1.default,
    type(data) {
        if (isMobilePhone_js_1.default(String(data), 'zh-CN')) {
            return { data };
        }
        else {
            return { error: '必须为手机号' };
        }
    },
});
types.set(symbol_js_1.default.email, {
    ...common_js_1.default,
    type(data) {
        if (isEmail_js_1.default(String(data))) {
            return { data };
        }
        else {
            return { error: '必须为Email格式' };
        }
    },
});
// 数据类型验证方法
exports.default = types;
