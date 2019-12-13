"use strict";
const types = require("./type.js");
const symbols = require("./symbol.js");
const common = require("./common.js");
const ignore = [undefined, null, ''];
class Parser {
    /**
     *
     * @param {*} options 验证表达式
     * @param {String} mode 验证模式
     */
    constructor(options, mode) {
        this.options = options;
        this.mode = mode;
    }
    /**
     * 执行数据验证
     * @param {*} origin 待验证原始数据
     */
    run(origin) {
        this.origin = origin;
        return this.recursion(origin, this.options, '');
    }
    /**
     * 判断是否允许为空值，默认将undefined、 null、空字符串视为空值
     * 默认值在大多数场景下适用，在出现例外时，可以在指定字段上使用ignore属性，重置对默认空值的定义
     * @param {*} data 需要校验空值的数据
     */
    isNull(data, ignore) {
        if (ignore.includes(data)) {
            return true;
        }
    }
    /**
     * 递归验证器
     * @param {*} data 待验证数据
     * @param {*} options 验证表达式
     * @param {String,Number} key 数据索引
     */
    recursion(data, options, key) {
        // 选项值为对象
        if (typeof options === 'object') {
            return this.object(data, options, key);
        }
        // 选项值为构造函数或Symbol，Symbol表示自定义类型
        else if (types.get(options)) {
            if (this.isNull(data, ignore)) {
                // 严格模式下，禁止空值
                if (this.mode === 'strict') {
                    return { error: "值不允许为空" };
                }
                return {};
            }
            const { data: subData, error } = types.get(options).type(data);
            if (subData) {
                return { data: subData };
            }
            else {
                return { error: `值${error}` };
            }
        }
        // 选项值为严格匹配的精确值类型
        else if (data === options) {
            return { data };
        }
        // 精确值匹配失败
        else {
            return { error: `值必须为${options}` };
        }
    }
    /**
     * 对象结构
     * @param {object} data
     * @param {*} options
     * @param {*} key
     */
    object(data, options, key) {
        // options为验证表达式
        if (options.type) {
            return this.expression(data, options, key);
        }
        // options为数组结构
        else if (Array.isArray(options)) {
            return this.array(data, options, key);
        }
        // options为对象结构
        else {
            if (typeof data !== 'object') {
                // 宽松模式下，跳过空值
                if (this.mode === 'loose') {
                    if (this.isNull(data, ignore))
                        return {};
                }
                return {
                    error: `值必须为Object类型`
                };
            }
            const dataObj = {};
            for (const sKey in options) {
                const { error, data: subData } = this.recursion(data[sKey], options[sKey], sKey);
                if (error) {
                    // 非根节点
                    if (key) {
                        return { error: `.${sKey}${error}` };
                    }
                    else {
                        return { error: `${sKey}${error}` };
                    }
                }
                else if (subData !== undefined) {
                    dataObj[sKey] = subData;
                }
            }
            return { data: dataObj };
        }
    }
    /**
     * 验证表达式
     * @param {*} data
     * @param {*} options
     * @param {*} key
     */
    expression(data, options, key) {
        // 空值处理
        if (this.isNull(data, options.ignore || ignore)) {
            // 默认值
            if (options.default) {
                data = options.default;
            }
            // 禁止空值
            else if (options.allowNull === false) {
                return { error: `值不允许为空` };
            }
            // 允许空值
            else if (options.allowNull === true) {
                return { data };
            }
            // 严格模式下，禁止空值
            else if (this.mode === 'strict') {
                return { error: `值不允许为空` };
            }
            else {
                return { data };
            }
        }
        const type = types.get(options.type);
        // type为内置数据类型
        if (type) {
            for (const name in options) {
                const method = type[name];
                if (method) {
                    const option = options[name];
                    const { error, data: subData } = method(data, option, this.origin);
                    if (error) {
                        return { error: `${error}` };
                    }
                    data = subData;
                }
            }
            return { data };
        }
        // 不支持的数据类型
        else {
            return { error: `${key}参数配置错误，不支持${options.type}类型` };
        }
    }
    /**
     * 数组结构
     * @param {*} data
     * @param {*} options
     * @param {*} key
     */
    array(data, options, key) {
        if (!Array.isArray(data)) {
            // 宽松模式下，跳过空值
            if (this.mode === 'loose') {
                if (this.isNull(data, ignore))
                    return {};
            }
            return {
                error: `${key}必须为数组类型`
            };
        }
        let itemKey = 0;
        const dataArray = [];
        // options为单数时采用通用匹配
        if (options.length === 1) {
            const [option] = options;
            for (const itemData of data) {
                // 子集递归验证
                const { error, data: subData } = this.recursion(itemData, option, itemKey);
                if (error) {
                    return { "error": `[${itemKey}]${error}` };
                }
                else if (subData !== undefined) {
                    dataArray.push(subData);
                }
                itemKey++;
            }
        }
        // options为复数时采用精确匹配
        else {
            for (const option of options) {
                const itemData = data[itemKey];
                // 子集递归验证
                const { error, data: subData } = this.recursion(itemData, option, itemKey);
                if (error) {
                    return { "error": `[${itemKey}]${error}` };
                }
                else if (subData !== undefined) {
                    dataArray.push(subData);
                }
                itemKey++;
            }
        }
        return { data: dataArray };
    }
}
/**
 * 验证器
 * @param {*} data 数据源
 * @param {*} options 验证表达式
 * @param {Object} extend 导出数据扩展函数集合
 * @param {String} mode 验证模式（仅供内部使用）
 */
function typea(data, options, extend = {}, mode) {
    const parser = new Parser(options, mode);
    const result = parser.run(data);
    if (result.error) {
        return result;
    }
    // 数据扩展函数，基于已验证的数据构建新的数据结构
    for (const name in extend) {
        let item = extend[name];
        if (typeof item === 'function') {
            item = item.call(result.data, result.data);
        }
        result.data[name] = item;
    }
    return result;
}
// 严格模式
typea.strict = function (data, options, extend = {}) {
    return typea(data, options, extend, 'strict');
};
// 宽松模式
typea.loose = function (data, options, extend = {}) {
    return typea(data, options, extend, 'loose');
};
typea.types = symbols;
/**
 * 自定义数据类型扩展方法
 * @param {Function, Symbol, String} type 数据类型
 * @param {Object} options 扩展选项
 * @param {Object.Function} options 扩展方法
 */
typea.use = function (type, options = {}) {
    if (!type)
        return;
    const value = types.get(type);
    // 通过Symbol定位，扩展已有数据类型
    if (value) {
        Object.assign(value, options);
    }
    // 通过String定位，扩展已有数据类型或创建新类型
    else if (typeof type === 'string') {
        // 扩展已有Symbol类型
        if (symbols[type]) {
            const symbol = symbols[type];
            const value = types.get(symbol);
            Object.assign(value, options);
        }
        // 创建新类型
        else {
            Object.assign(options, common);
            const symbol = Symbol(type);
            symbols[type] = symbol;
            types.set(symbol, options);
        }
    }
};
/**
 * 通过预处理方式，将提前处理好的静态options持久化驻留在内存中
 * 避免同一个对象被多次重复的创建和销毁，实现options跨接口复用，在节省资源的同时，也增加了代码复用率
 * @param {*} options 验证表达式
 * @param {Object} extend 数据扩展选项
 */
typea.schema = function (options, extend) {
    const schema = function (data) {
        return typea(data, options, extend, undefined);
    };
    /**
     * 严格模式
     * 禁止所有空值，有值验证，无值报错
     */
    schema.strict = function (data) {
        return typea(data, options, extend, 'strict');
    };
    /**
     * 宽松模式
     * 忽略所有空值，有值验证，无值跳过，即使allowNull值为true
     */
    schema.loose = function (data) {
        return typea(data, options, extend, 'loose');
    };
    return schema;
};
module.exports = typea;
