"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.object = exports.toString = exports.array = exports.any = exports.func = exports.symbol = exports.boolean = exports.number = exports.string = void 0;
const createType_js_1 = require("./createType.js");
exports.string = (0, createType_js_1.Type)("string", {
    // 验证 string 类型
    type(data) {
        if (typeof data === 'string') {
            return { data };
        }
        else {
            return { error: "值必须为 string 类型" };
        }
    },
    // 限制最小长度
    min(data, min) {
        if (data.length < min) {
            return { error: `值长度不能小于 "${min}" 个字符` };
        }
        else {
            return { data };
        }
    },
    // 限制最大长度
    max(data, max) {
        if (data.length > max) {
            return { error: `值长度不能大于 "${max}" 个字符` };
        }
        else {
            return { data };
        }
    },
    // 正则
    reg(data, reg) {
        if (data.search(reg) === -1) {
            return { error: '正则表达式格式错误' };
        }
        else {
            return { data };
        }
    },
    // 包含
    in(data, array) {
        const result = array.indexOf(data);
        if (result === -1) {
            return { error: `值必须为 [${array}] 选项其中之一` };
        }
        else {
            return { data };
        }
    }
});
(0, createType_js_1.TypeBind)(String, exports.string);
exports.number = (0, createType_js_1.Type)("number", {
    type(data) {
        if (typeof data === 'number') {
            return { data };
        }
        else {
            return { error: '值必须为 number 类型' };
        }
    },
    min(data, min) {
        if (data < min) {
            return { error: `值不能小于 "${min}"` };
        }
        else {
            return { data };
        }
    },
    max(data, max) {
        if (data > max) {
            return { error: `值不能大于 "${max}"` };
        }
        else {
            return { data };
        }
    },
    // 匹配多个可选值中的一个
    in(data, array) {
        const result = array.indexOf(data);
        if (result === -1) {
            return { error: `值必须为 "${array}" 中的一个` };
        }
        else {
            return { data };
        }
    }
});
(0, createType_js_1.TypeBind)(Number, exports.number);
exports.boolean = (0, createType_js_1.Type)("boolean", {
    type(data) {
        if (typeof data === 'boolean') {
            return { data };
        }
        else {
            return { error: '值必须为 boolean 类型' };
        }
    }
});
(0, createType_js_1.TypeBind)(Boolean, exports.boolean);
exports.symbol = (0, createType_js_1.Type)("symbol", {
    type(data) {
        if (typeof data === 'symbol') {
            return { data };
        }
        else {
            return { error: '值必须为 symbol 类型' };
        }
    }
});
(0, createType_js_1.TypeBind)(Symbol, exports.symbol);
exports.func = (0, createType_js_1.Type)("func", {
    type(data) {
        if (typeof data === 'function') {
            return { data };
        }
        else {
            return { error: '值必须为 function 类型' };
        }
    }
});
(0, createType_js_1.TypeBind)(Function, exports.func);
exports.any = (0, createType_js_1.Type)("any", {
    type(data) { return { data }; }
});
// 结构体数组
exports.array = (0, createType_js_1.Struct)("array", {
    type(data) {
        if (Array.isArray(data)) {
            return { data };
        }
        else {
            return { error: '值必须为 array 类型' };
        }
    },
    min(data, min) {
        if (data.length < min) {
            return { error: `值长度不能小于 "${min}" 个字符` };
        }
        else {
            return { data };
        }
    },
    max(data, max) {
        if (data.length > max) {
            return { error: `值长度不能大于 "${max} "个字符` };
        }
        else {
            return { data };
        }
    }
});
(0, createType_js_1.TypeBind)(Array, exports.array);
exports.toString = Object.prototype.toString;
// 结构体对象
exports.object = (0, createType_js_1.Struct)("object", {
    type(data) {
        if (exports.toString.call(data) === '[object Object]') {
            return { data };
        }
        else {
            return { error: "值必须为 object 类型" };
        }
    }
});
(0, createType_js_1.TypeBind)(Object, exports.object);
const types = {
    string: exports.string,
    number: exports.number,
    boolean: exports.boolean,
    symbol: exports.symbol,
    func: exports.func,
    any: exports.any,
    array: exports.array,
    object: exports.object
};
exports.default = types;
