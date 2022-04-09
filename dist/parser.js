import { type, symbols } from './types.js';
const defaultIgnore = [undefined, null, ''];
export default class Parser {
    /**
     * @param mode 验证模式
     */
    constructor(mode) {
        this.mode = mode;
    }
    /**
     * 递归验证器
     * @param key 数据索引
     * @param data 待验证数据
     * @param node 验证表达式
     */
    recursion(key, data, node) {
        // 节点为对象或数组
        if (typeof node === 'object') {
            return this.object(key, data, node);
        }
        // 节点为 JS 基础数据类型构造函数或自定义类型
        else if (node[type]) {
            if (defaultIgnore.includes(data)) {
                // 严格模式下，禁止空值
                if (this.mode === 'strict') {
                    return { error: "值不允许为空" };
                }
                return {};
            }
            const { error, data: subData } = node[type].type(data);
            if (error) {
                return { error: `值${error}` };
            }
            else {
                return { data: subData };
            }
        }
        // 节点为函数类型
        else if (typeof node === 'function') {
            if (typeof data === 'function') {
                node(data, (value) => data = value);
                return { data };
            }
            else {
                return { error: `值必须为 function 类型` };
            }
        }
        // 节点为精确赋值匹配
        else if (data === node) {
            return { data };
        }
        // 精确值匹配失败
        else {
            return { error: `值必须为 ${node}` };
        }
    }
    /**
     * 对象类型节点
     * @param key 属性名
     * @param data 待验证数据
     * @param node 验证表达式
     */
    object(key, data, node) {
        const methods = node[type];
        // node 为类型
        if (methods) {
            return this.type(key, data, methods, node.options);
        }
        // node 为数组结构
        else if (Array.isArray(node)) {
            return this.array(key, data, node);
        }
        // node 为对象结构
        else {
            if (typeof data !== 'object') {
                // 宽松模式下，跳过空值
                if (this.mode === 'loose') {
                    if (defaultIgnore.includes(data))
                        return {};
                }
                return { error: `值必须为 Object 类型` };
            }
            // 提取 symbol 索引表达式
            const symbolKeys = Object.getOwnPropertySymbols(node);
            for (const symbol of symbolKeys) {
                const { description } = symbol;
                if (description === 'optional') {
                    const name = symbols[symbol];
                    node[name] = node[symbol];
                    console.log(node[name]);
                }
                else if (description == 'index') {
                    const { name, types } = symbols[symbol];
                    // console.log(name, types)
                }
            }
            const dataObj = {};
            for (const sKey in node) {
                const { error, data: subData } = this.recursion(sKey, data[sKey], node[sKey]);
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
     * 数组类型节点
     * @param key
     * @param data
     * @param express
     */
    array(key, data, express) {
        if (!Array.isArray(data)) {
            // 宽松模式下，跳过空值
            if (this.mode === 'loose') {
                if (defaultIgnore.includes(data))
                    return {};
            }
            return { error: `${key}必须为 Array 类型` };
        }
        let itemKey = 0;
        const dataArray = [];
        // 只有一个子表达式，可以表示一对一的精确匹配，也可以表示一对多泛匹配
        // 当有多个子表达式时，每个子表达示的占位与值之间一对一精确匹配，概念等同于 Typescript 中的元组类型
        if (express.length === 1) {
            const [options] = express;
            for (const itemData of data) {
                // 子集递归验证
                const { error, data: subData } = this.recursion(itemKey, itemData, options);
                if (error) {
                    return { "error": `[${itemKey}] ${error}` };
                }
                else if (subData !== undefined) {
                    dataArray.push(subData);
                }
                itemKey++;
            }
        }
        // express 为复数时采用精确匹配
        else {
            for (const options of express) {
                const itemData = data[itemKey];
                // 子集递归验证
                const { error, data: subData } = this.recursion(itemKey, itemData, options);
                if (error) {
                    return { "error": `[${itemKey}] ${error}` };
                }
                else if (subData !== undefined) {
                    dataArray.push(subData);
                }
                itemKey++;
            }
        }
        return { data: dataArray };
    }
    /**
     * 类型选项节点
     * @param key
     * @param data
     * @param options
     */
    type(key, data, methods, options) {
        let methodsOption;
        if (options) {
            const { ignore, default: defaultValue, allowNull, ...other } = options;
            methodsOption = other;
            // 空值处理
            if ((ignore || defaultIgnore).includes(data)) {
                // 填充默认值
                if (defaultValue) {
                    data = defaultValue;
                }
                // 禁止空值
                else if (allowNull === false) {
                    return { error: `值不允许为空` };
                }
                // 允许空值
                else if (allowNull === true) {
                    return { data };
                }
                // 严格模式下，强制禁止空值
                else if (this.mode === 'strict') {
                    return { error: `值不允许为空` };
                }
                else {
                    return { data };
                }
            }
        }
        else {
            if (defaultIgnore.includes(data)) {
                // 严格模式下，强制禁止空值
                if (this.mode === 'strict') {
                    return { error: `值不允许为空` };
                }
            }
        }
        const { error, data: value } = methods.type(data);
        if (error) {
            return { error };
        }
        else {
            data = value;
        }
        if (methodsOption) {
            for (const name in methodsOption) {
                const method = methods[name]; // 每个有效的 express.name 都有对应的 methods[name]() 处理函数
                if (method) {
                    const option = methodsOption[name];
                    const { error, data: value } = method(data, option);
                    if (error) {
                        return { error };
                    }
                    else {
                        data = value;
                    }
                }
            }
        }
        return { data };
    }
}
