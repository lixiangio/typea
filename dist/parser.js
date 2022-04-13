import { typeKey, extensionKey, stringKey, symbols } from './types.js';
const { toString, hasOwnProperty } = Object.prototype;
export default class Parser {
    /**
     * 递归验证器
     * @param data 待验证数据
     * @param node 验证表达式
     */
    verify(node, data) {
        // node 为类型函数
        if (typeof node === 'function') {
            const methods = node[typeKey];
            // 带有 symbol('type') 的非对象类型函数，仅用作类型声明，不执行，无参数
            if (methods) {
                const { error, data: subData } = methods.type(data);
                if (error) {
                    return { error: ` ${error}` };
                }
                else {
                    return { data: subData };
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
        // node 为 object 或 array
        else if (node instanceof Object) {
            const methods = node[typeKey];
            // node 为类型对象
            if (methods) {
                return this.type(methods, node.options, data);
            }
            // node 为数组结构
            else if (Array.isArray(node)) {
                return this.array(node, data);
            }
            // node 为对象结构
            else {
                return this.object(node, data);
            }
        }
        // node 为字面量赋值类型
        else if (data === node) {
            return { data };
        }
        // 字面类型匹配失败
        else {
            return { error: ` 值必须为${node}` };
        }
    }
    /**
     * 对象结构
     * @param data 待验证数据
     * @param node 验证表达式
     */
    object(node, data) {
        if (toString.call(data) !== '[object Object]') {
            return { error: " 值必须为 object 类型" };
        }
        const mixinNode = { ...node };
        // 提 key 中的 symbol 类型索引表达式
        const symbolKeys = Object.getOwnPropertySymbols(node);
        for (const symbol of symbolKeys) {
            // 可选属性，仅当数据中属性名称存在时才参与校验
            if (symbol.description === 'optional') {
                const name = symbols[symbol];
                if (hasOwnProperty.call(data, name)) {
                    mixinNode[name] = node[symbol];
                }
            }
        }
        const indexSbuNode = node[stringKey];
        // 有索引时，将 data 中的非模型属性添加至混合模型
        if (indexSbuNode) {
            for (const name in data) {
                if (hasOwnProperty.call(mixinNode, name) === false) {
                    mixinNode[name] = indexSbuNode;
                }
            }
        }
        // 无索引时，仅检查模型中声明的属性，忽略模型以外的属性
        else {
            for (const name in mixinNode) {
                if (hasOwnProperty.call(data, name) === false) {
                    return { error: `.${name} 属性不存在` };
                }
            }
        }
        const result = {};
        // 验证混合模型
        for (const name in mixinNode) {
            const { error, data: value } = this.verify(mixinNode[name], data[name]);
            if (error) {
                return { error: `.${name}${error}` };
            }
            else {
                result[name] = value;
            }
        }
        return { data: result };
    }
    /**
   * 数组结构
   * @param data
   * @param node
   */
    array(node, data) {
        if (Array.isArray(data) === false) {
            return { error: ` 值必须为 array 类型` };
        }
        const result = [];
        let index = 0;
        let iteratorError;
        for (const item of node) {
            if (item instanceof Object) {
                // 扩展类型对象，一对多匹配，试探性向后匹配，直至类型匹配失败或无索引
                if (item[extensionKey]) {
                    let next = true;
                    const typeObject = item.type;
                    while (next) {
                        if (hasOwnProperty.call(data, index)) {
                            const { error, data: subData } = this.verify(typeObject, data[index]);
                            if (error) {
                                iteratorError = error;
                                next = false;
                            }
                            else {
                                index++;
                                result.push(subData);
                            }
                        }
                        else {
                            next = false;
                        }
                    }
                }
                // 类型函数、类型对象、结构对象、结构数组，一对一匹配
                else {
                    const { error, data: subData } = this.verify(item, data[index]);
                    if (error) {
                        return { "error": `[${index}] ${error}` };
                    }
                    else {
                        index++;
                        result.push(subData);
                        iteratorError = null;
                    }
                }
            }
            // 字面量全等匹配
            else {
                if (item === data[index]) {
                    index++;
                    result.push(item);
                    iteratorError = null;
                }
                else {
                    return { error: `[${index}] 值必须全等于${item}` };
                }
            }
        }
        // 索引未完全匹配
        if (data.length > index) {
            if (iteratorError) {
                return { error: `[${index}]${iteratorError}` };
            }
            else {
                return { error: `[${index}] 超出最大索引匹配范围` };
            }
        }
        return { data: result };
    }
    /**
     * 类型结构
     * @param data 待验证数据
     * @param methods 验证方法
     * @param options 验证选项
     */
    type(methods, options, data) {
        if (options) {
            const { set, default: defaultValue, allowNull, ...other } = options;
            if (set) {
                data = set(data);
            }
            // 空值处理选项
            else if (data === undefined) {
                // 填充默认值
                if (defaultValue) {
                    data = defaultValue;
                }
                // 允许空值
                else if (allowNull === true) {
                    return { data };
                }
                else {
                    return { error: " 值不允许为空" };
                }
            }
            const { error } = methods.type(data);
            if (error)
                return { error: ` ${error}` };
            // 扩展验证选项
            for (const name in other) {
                const method = methods[name]; // 每个有效的 node[$name] 对应一个 methods[$name]() 处理函数
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
                return { error: " 值不允许为 undefined" };
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
