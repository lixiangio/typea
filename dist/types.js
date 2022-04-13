import typea from './index.js';
export const typeKey = Symbol('type');
export const extensionKey = Symbol('extensionKey');
export const stringKey = Symbol('stringKey');
export const iteratorKey = Symbol.iterator;
/**
 * 扩展类型数组迭代器
 */
function iteratorMethod() {
    const type = this;
    return {
        end: false,
        next() {
            if (this.end) {
                this.end = false;
                return { done: true };
            }
            else {
                this.end = true;
                return { value: { [extensionKey]: true, type } };
            }
        }
    };
}
/**
 * 添加数据类型声明
 * @param name 类型名称
 * @param methods 验证方法
 * @param TypeFunction 附加类型
 */
export function addDataType(name, methods, TypeFunction) {
    const result = {
        [name](options) {
            return {
                [typeKey]: methods,
                [iteratorKey]: iteratorMethod,
                options
            };
        }
    };
    const typefn = result[name];
    typefn[typeKey] = methods;
    typefn[iteratorKey] = iteratorMethod;
    typea[name] = typefn;
    if (TypeFunction) {
        TypeFunction[typeKey] = methods;
        TypeFunction[iteratorKey] = iteratorMethod;
    }
}
addDataType('string', {
    // string 类型验证
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
            return { error: `值长度不能小于${min}个字符` };
        }
        else {
            return { data };
        }
    },
    // 限制最大长度
    max(data, max) {
        if (data.length > max) {
            return { error: `值长度不能大于"${max}"个字符` };
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
}, String);
addDataType('number', {
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
            return { error: `值不能小于"${min}"` };
        }
        else {
            return { data };
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
    // 包含
    in(data, array) {
        const result = array.indexOf(data);
        if (result === -1) {
            return { error: `值必须为"${array}"中的一个` };
        }
        else {
            return { data };
        }
    }
}, Number);
addDataType('boolean', {
    type(data) {
        if (typeof data === 'boolean') {
            return { data };
        }
        else {
            return { error: '值必须为 boolean 类型' };
        }
    }
}, Boolean);
addDataType('symbol', {
    type(data) {
        if (typeof data === 'symbol') {
            return { data };
        }
        else {
            return { error: '值必须为 symbol 类型' };
        }
    }
}, Symbol);
addDataType('array', {
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
            return { error: `值长度不能小于 ${min} 个字符` };
        }
        else {
            return { data };
        }
    },
    max(data, max) {
        if (data.length > max) {
            return { error: `值长度不能大于 ${max} 个字符` };
        }
        else {
            return { data };
        }
    }
}, Array);
const { toString } = Object.prototype;
addDataType('object', {
    type(data) {
        if (toString.call(data) === '[object Object]') {
            return { data };
        }
        else {
            return { error: '值必须为 object 类型' };
        }
    }
}, Object);
Function[typeKey] = {
    type(data) {
        if (typeof data === 'function') {
            return { data };
        }
        else {
            return { error: '值必须为 function 类型' };
        }
    }
};
/////////////////////// 扩展类型 ///////////////////////
addDataType('any', {
    type(data) { return { data }; }
});
const unionMethods = {
    type(data) {
        return { data };
    }
};
/**
 * 联合类型
 * @param options
 */
function union(...options) {
    return { [typeKey]: unionMethods, options };
}
union[typeKey] = unionMethods;
//////////////////// 索引类型 ///////////////////
export const symbols = {};
// 可选属性
function optional(name) {
    const symbol = Symbol('optional');
    symbols[symbol] = name;
    return symbol;
}
Object.assign(typea, {
    union,
    optional,
    stringKey,
    /**
     * 扩展类型数据包装器，用于将对象、数组类型标记为可迭代类型
     */
    iterator(type) {
        return { [extensionKey]: true, type };
    }
});