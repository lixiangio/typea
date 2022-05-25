import { Base, Struct, typeBind } from './createType.js';
export const string = Base("string", {
    type(data) {
        if (typeof data === 'string') {
            return { data };
        }
        else {
            return { error: "值必须为 string 类型" };
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
            return { error: `值长度不能大于 "${max}" 个字符` };
        }
        else {
            return { data };
        }
    },
    reg(data, reg) {
        if (data.search(reg) === -1) {
            return { error: '正则表达式格式错误' };
        }
        else {
            return { data };
        }
    },
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
export const number = Base("number", {
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
export const boolean = Base("boolean", {
    type(data) {
        if (typeof data === 'boolean') {
            return { data };
        }
        else {
            return { error: '值必须为 boolean 类型' };
        }
    }
});
export const symbol = Base("symbol", {
    type(data) {
        if (typeof data === 'symbol') {
            return { data };
        }
        else {
            return { error: '值必须为 symbol 类型' };
        }
    }
});
export const func = Base("func", {
    type(data) {
        if (typeof data === 'function') {
            return { data };
        }
        else {
            return { error: '值必须为 function 类型' };
        }
    }
});
export const any = Base("any", {
    type(data) { return { data }; }
});
typeBind(String, string);
typeBind(Number, number);
typeBind(Boolean, boolean);
typeBind(Function, func);
typeBind(Symbol, symbol);
export const array = Struct("array", {
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
const { toString } = Object.prototype;
export const object = Struct("object", {
    type(data) {
        if (toString.call(data) === '[object Object]') {
            return { data };
        }
        else {
            return { error: "值必须为 object 类型" };
        }
    }
});
typeBind(Array, array);
typeBind(Object, object);
