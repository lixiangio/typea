import addType, { baseBind } from './addType.js';
export const string = addType({
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
baseBind(String, string);
export const number = addType({
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
    // 包含
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
baseBind(Number, number);
export const boolean = addType({
    type(data) {
        if (typeof data === 'boolean') {
            return { data };
        }
        else {
            return { error: '值必须为 boolean 类型' };
        }
    }
});
baseBind(Boolean, boolean);
export const symbol = addType({
    type(data) {
        if (typeof data === 'symbol') {
            return { data };
        }
        else {
            return { error: '值必须为 symbol 类型' };
        }
    }
});
baseBind(Symbol, symbol);
export const array = addType({
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
baseBind(Array, array);
const { toString } = Object.prototype;
export const object = addType({
    type(data) {
        if (toString.call(data) === '[object Object]') {
            return { data };
        }
        else {
            return { error: '值必须为 object 类型' };
        }
    }
});
baseBind(Object, object);
export const func = addType({
    type(data) {
        if (typeof data === 'function') {
            return { data };
        }
        else {
            return { error: '值必须为 function 类型' };
        }
    }
});
baseBind(Function, func);
/////////////////////// 非基础类型 ///////////////////////
export const any = addType({
    type(data) { return { data }; }
});
