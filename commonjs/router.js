"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = exports.object = exports.entry = void 0;
const common_js_1 = require("./common.js");
const { toString, hasOwnProperty } = Object.prototype;
/**
 * 数据入口
 * @param node 数据模型
 * @param data 数据实例
 */
function entry(node, data) {
    // node 为 object 或 array
    if (node instanceof Object) {
        const method = node[common_js_1.methodKey];
        // node 中携带 Symbol('methodKey')，表示绑定了可执行函数
        if (method) {
            return method(node[common_js_1.optionsKey], data);
        }
        // node 为结构体对象
        else if (toString.call(node) === '[object Object]') {
            if (toString.call(data) === '[object Object]') {
                return object(node, data);
            }
            else {
                return { error: " 值必须为 object 类型" };
            }
        }
        // node 为结构体数组
        else if (Array.isArray(node)) {
            if (Array.isArray(data)) {
                return array(node, data);
            }
            else {
                return { error: ` 值必须为 array 类型` };
            }
        }
        // node 为函数表达式
        else {
            if (typeof data === 'function') {
                node(data, (value) => data = value);
                return { data };
            }
            else {
                return { error: " 值必须为 function 类型" };
            }
        }
    }
    // node 为字面量赋值类型
    else if (data === node) {
        return { data };
    }
    // 字面类型匹配失败
    else {
        return { error: ` 值必须为 ${node}，实际得到 ${data}` };
    }
}
exports.entry = entry;
/**
 * 对象结构
 * @param node 数据模型
 * @param data 数据实例
 */
function object(node, data) {
    const checkNode = {}, result = {};
    // 提取模型中声明的属性，用于下一步的统一验证
    for (const name in node) {
        const sub = node[name];
        // 可选属性
        if (sub && hasOwnProperty.call(sub, common_js_1.optionalKey)) {
            // 有匹配数据，使用子节点覆盖可选节点
            if (hasOwnProperty.call(data, name)) {
                checkNode[name] = sub[common_js_1.optionalKey]; // 可选属性中保存了节点的数据类型或结构体
            }
            // 无匹配数据，忽略可选属性缺失错误
            else {
                const options = sub[common_js_1.optionsKey];
                if (options instanceof Object) {
                    if (options.set) {
                        result[name] = options.set(options.default);
                    }
                    else if (hasOwnProperty.call(options, 'default')) {
                        result[name] = options.default;
                    }
                }
            }
        }
        // 必选属性
        else if (hasOwnProperty.call(data, name)) {
            checkNode[name] = sub;
        }
        else {
            return { error: `.${name} 属性缺失` };
        }
    }
    // 有索引签名，将 data 中的非模型属性添加至混合模型
    if (hasOwnProperty.call(node, common_js_1.indexKey)) {
        const indexSbuNode = node[common_js_1.indexKey];
        for (const name in data) {
            if (hasOwnProperty.call(checkNode, name) === false) {
                checkNode[name] = indexSbuNode;
            }
        }
    }
    // 混合子模型验证
    for (const name in checkNode) {
        const { error, data: value } = entry(checkNode[name], data[name]);
        if (error) {
            return { error: `.${name}${error}` };
        }
        else {
            result[name] = value;
        }
    }
    return { data: result };
}
exports.object = object;
/**
* 数组结构
* @param node 数据模型
* @param data 数据实例
*/
function array(node, data) {
    const result = [];
    let index = 0;
    let iteratorError = '';
    for (const item of node) {
        if (item instanceof Object) {
            // 类型扩展节点，一对多匹配，试探性向后匹配，直至同类型匹配失败或无索引
            if (hasOwnProperty.call(item, common_js_1.extensionKey)) {
                let next = true;
                const subNode = item[common_js_1.extensionKey];
                while (next) {
                    if (hasOwnProperty.call(data, index)) {
                        const { error, data: subData } = entry(subNode, data[index]);
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
                const { error, data: subData } = entry(item, data[index]);
                if (error) {
                    if (hasOwnProperty.call(item, common_js_1.optionalKey) === false) {
                        return { "error": `[${index}]${error}` };
                    }
                }
                else {
                    index++;
                    result.push(subData);
                    iteratorError = '';
                }
            }
        }
        // 字面量全等匹配
        else if (hasOwnProperty.call(data, index)) {
            if (item === data[index]) {
                index++;
                result.push(item);
                iteratorError = '';
            }
            else {
                return { error: `[${index}] 值必须为 ${item}，实际得到 ${data[index]}` };
            }
        }
        else {
            return { error: `[${index}] 属性缺失，值必须为 ${item}` };
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
exports.array = array;
