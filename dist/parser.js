import { type, symbols, stringKey } from './types.js';
const { toString } = Object.prototype;
export default class Parser {
    /**
     * 递归验证器
     * @param index 数据索引
     * @param data 待验证数据
     * @param node 验证表达式
     */
    verify(index, data, node) {
        // node 为类型函数
        if (typeof node === 'function') {
            const methods = node[type];
            // 带有 symbol('type') 的非对象类型函数，仅用作类型声明，不执行，也不传递参数
            if (methods) {
                if (data === undefined) {
                    return { error: " 值不允许为空" };
                }
                else {
                    const { error, data: subData } = methods.type(data);
                    if (error) {
                        return { error: ` ${error}` };
                    }
                    else {
                        return { data: subData };
                    }
                }
            }
            // 函数表达式
            else if (typeof data === 'function') {
                node(data, (value) => data = value);
                return { data };
            }
            else {
                return { error: " 值必须为 function 类型" };
            }
        }
        // 节点为对象或数组
        else if (node instanceof Object) {
            const methods = node[type];
            // node 为类型对象,来自类型函数的返回值
            if (methods) {
                return this.type(index, data, methods, node.options);
            }
            // node 为数组对象
            else if (Array.isArray(node)) {
                return this.array(index, data, node);
            }
            else {
                return this.object(index, data, node);
            }
        }
        // 节点为字面赋值类型
        else if (data === node) {
            return { data };
        }
        // 字面类型匹配失败
        else {
            return { error: ` 值必须为 "${node}"` };
        }
    }
    /**
     * 对象类型节点
     * @param index 属性名
     * @param data 待验证数据
     * @param node 验证表达式
     */
    object(index, data, node) {
        if (toString.call(data) !== '[object Object]') {
            return { error: " 值必须为 object 类型" };
        }
        // 提取 symbol 索引表达式
        const symbolKeys = Object.getOwnPropertySymbols(node);
        for (const symbol of symbolKeys) {
            // 模型中包含可选属性，仅当数据中属性名称存在时才参与校验
            if (symbol.description === 'optional') {
                const name = symbols[symbol];
                if (data.hasOwnProperty(name)) {
                    const subNode = node[symbol];
                    node[name] = subNode;
                }
            }
        }
        const result = {};
        for (const name in node) {
            if (data.hasOwnProperty(name)) {
                const { error, data: value } = this.verify(name, data[name], node[name]);
                if (error) {
                    // 非根节点
                    if (index) {
                        return { error: `.${name}${error}` };
                    }
                    else {
                        return { error: `${name}${error}` };
                    }
                }
                else {
                    result[name] = value;
                }
            }
            else {
                return { error: `${name} 属性不存在` };
            }
        }
        const indexNode = node[stringKey];
        // 有索引类型，对模型以外的剩余属性进行索引验证
        if (indexNode) {
            for (const name in data) {
                if (node.hasOwnProperty(name) === false) {
                    const { error, data: value } = this.verify(name, data[name], indexNode);
                    if (error) {
                        // 非根节点
                        if (index) {
                            return { error: `.${name}${error}` };
                        }
                        else {
                            return { error: `${name}${error}` };
                        }
                    }
                    else {
                        result[name] = value;
                    }
                }
            }
        }
        return { data: result };
    }
    /**
     * 数组类型节点
     * @param index
     * @param data
     * @param express
     */
    array(index, data, express) {
        if (Array.isArray(data) === false) {
            return { error: `${index} 值必须为 Array 类型` };
        }
        let itemKey = 0;
        const dataArray = [];
        // 只有一个子表达式时，循环复用子表达式，匹配一个或多个子项
        // 当有多个子表达式时，每个子表达示的占位与值之间一对一精确匹配，概念等同于 Typescript 中的元组类型
        if (express.length === 1) {
            const [options] = express;
            for (const item of data) {
                // 子集递归验证
                const { error, data: subData } = this.verify(itemKey, item, options);
                if (error) {
                    return { "error": `[${itemKey}]${error}` };
                }
                else if (subData !== undefined) {
                    dataArray.push(subData);
                }
                itemKey++;
            }
        }
        // express 为复数时表示元组匹配
        else {
            for (const item of data) {
                const options = express[itemKey];
                // 子集递归验证
                const { error, data: subData } = this.verify(itemKey, item, options);
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
    /**
     * 类型选项节点
     * @param key
     * @param data
     * @param options
     */
    type(key, data, methods, options) {
        if (options) {
            const { set, default: defaultValue, allowNull, ...other } = options;
            if (set) {
                return { data: set(data) };
            }
            // 空值处理选项
            else if (data === undefined) {
                // 填充默认值
                if (defaultValue) {
                    return { data: defaultValue };
                }
                // 禁止空值
                else if (allowNull === false) {
                    return { error: " 值不允许为空" };
                }
                // 允许空值
                else if (allowNull === true) {
                    return { data };
                }
                else {
                    return { error: " 值不允许为空" };
                }
            }
            else {
                const { error } = methods.type(data);
                if (error)
                    return { error: ` ${error}` };
            }
            // 其它验证选项
            for (const name in other) {
                const method = methods[name]; // 每个有效的 express.name 都有对应的 methods[name]() 处理函数
                if (method) {
                    const option = other[name];
                    const { error, data: value } = method(data, option);
                    if (error) {
                        return { error: ` ${error}` };
                    }
                    else {
                        data = value;
                    }
                }
            }
            return { data };
        }
        else {
            if (data === undefined) {
                return { error: " 值不允许为空" };
            }
            else {
                const { error } = methods.type(data);
                if (error)
                    return { error: ` ${error}` };
            }
            return { data };
        }
    }
}
