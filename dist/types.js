// 通用验证方法
export const base = {
    /**
     * 函数赋值
     * @param data 数据
     * @param method 赋值函数
     */
    set(data, method) {
        return { data: method(data) };
    },
    /**
     * 直接赋值（覆盖原来的值）
     * @param data 不使用，忽略赋值
     * @param value 将选项作为值使用，覆盖之前的值
     */
    value(data, value) {
        return { data: value };
    }
};
export const type = Symbol('type');
const stringMethods = {
    // string 类型验证
    type(data) {
        if (typeof data === 'string') {
            return { data: data.trim() };
        }
        else {
            return { error: "必须为 string 类型" };
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
            return { error: `长度不能大于"${max}"个字符` };
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
    },
    ...base
};
function string(options) {
    return {
        [type]: stringMethods,
        options
    };
}
string[type] = stringMethods;
String[type] = stringMethods;
const numberMethods = {
    type(data) {
        if (isNaN(data)) {
            return { error: '必须为 number 类型' };
        }
        else {
            return { data: Number(data) };
        }
    },
    min(data, min) {
        if (data < min) {
            return { error: `不能小于"${min}"` };
        }
        else {
            return { data };
        }
    },
    max(data, max) {
        if (data > max) {
            return { error: `不能大于"${max}"` };
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
    },
    ...base
};
function number(options) {
    return {
        [type]: numberMethods,
        options
    };
}
number[type] = numberMethods;
Number[type] = numberMethods;
const booleanMethods = {
    type(data) {
        if (typeof data === 'boolean') {
            return { data };
        }
        else {
            return { error: '必须为 boolean 类型' };
        }
    },
    ...base
};
function boolean(options) {
    return {
        [type]: booleanMethods,
        options
    };
}
boolean[type] = booleanMethods;
Boolean[type] = booleanMethods;
const arrayMethods = {
    type(data) {
        if (Array.isArray(data)) {
            return { data };
        }
        else {
            return { error: '必须为 array 类型' };
        }
    },
    min(data, min) {
        if (data.length < min) {
            return { error: `长度不能小于 ${min} 个字符` };
        }
        else {
            return { data };
        }
    },
    max(data, max) {
        if (data.length > max) {
            return { error: `长度不能大于 ${max} 个字符` };
        }
        else {
            return { data };
        }
    },
    ...base
};
function array(options) {
    return {
        [type]: arrayMethods,
        options
    };
}
array[type] = arrayMethods;
Array[type] = arrayMethods;
const objectMethods = {
    type(data) {
        if (typeof data === 'object') {
            return { data };
        }
        else {
            return { error: '必须为 object 类型' };
        }
    },
    ...base
};
function object(options) {
    return {
        [type]: objectMethods,
        options
    };
}
object[type] = objectMethods;
Object[type] = objectMethods;
const symbolMethods = {
    type(data) {
        if (typeof data === 'symbol') {
            return { data };
        }
        else {
            return { error: '必须为 function 类型' };
        }
    },
    ...base
};
function symbol(options) {
    return { [type]: symbolMethods, options };
}
symbol[type] = symbolMethods;
Symbol[type] = symbolMethods;
const functionMethods = {
    type(data) {
        if (typeof data === 'function') {
            return { data };
        }
        else {
            return { error: '必须为 function 类型' };
        }
    },
    ...base
};
// function func(options: Options) {
//   return {
//     [type]: functionMethods,
//     options
//   };
// }
Function[type] = functionMethods;
/////////////////////// 非基础类型 ///////////////////////
const anyMethods = {
    type(data) { return { data }; },
    ...base
};
function any(options) {
    return { [type]: anyMethods, options };
}
any[type] = anyMethods;
const unionMethods = {
    type(data) {
        return { data };
    }
};
/**
 * 联合类型
 * @param options
 * @returns
 */
function union(...options) {
    return { [type]: unionMethods, options };
}
union[type] = anyMethods;
//////////////////// index 类型 ///////////////////
export const symbols = {};
function index(name, ...types) {
    const symbol = Symbol('index');
    symbols[symbol] = { name, types };
    return symbol;
}
function optional(name) {
    const symbol = Symbol('optional');
    symbols[symbol] = name;
    return symbol;
}
export const types = {
    string,
    number,
    boolean,
    array,
    object,
    symbol,
    any,
    union,
    index,
    optional
};
