/**
 * 通用验证方法
 */
export const base = {
    /**
     * 参数自定义转换方法
     * @param data 数据
     * @param options 赋值函数
     * @returns
     */
    set(data, options) {
        return { data: options(data) };
    },
    /**
     * 直接赋值（覆盖原来的值）
     * @param data 不使用，忽略赋值
     * @param options 将选项作为值使用，覆盖之前的值
     */
    value(data, options) {
        return { data: options };
    }
};
const types = new Map();
types.set(String, {
    // 数据类型验证
    type(data) {
        if (typeof data === 'string') {
            return { data: data.trim() };
        }
        else if (typeof data === 'number') {
            return { data: data.toString() };
        }
        else {
            return { error: '必须为 string 类型' };
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
            return { error: `值必须为 [${array}] 选项其中之一` };
        }
        else {
            return { data };
        }
    },
    ...base
});
types.set(Number, {
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
});
types.set(Array, {
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
    ...base
});
types.set(Object, {
    type(data) {
        if (typeof data === 'object') {
            return { data };
        }
        else {
            return { error: '必须为 object 类型' };
        }
    },
    ...base
});
types.set(Boolean, {
    type(data) {
        if (typeof data === 'boolean') {
            return { data };
        }
        else {
            return { error: '必须为 boolean 类型' };
        }
    },
    ...base
});
types.set(Function, {
    type(data) {
        if (typeof data === 'function') {
            return { data };
        }
        else {
            return { error: '必须为 function 类型' };
        }
    },
    ...base
});
// 数据类型验证方法
export default types;
