"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.union = exports.omit = exports.pick = exports.required = exports.partial = exports.optional = void 0;
const router_js_1 = require("./router.js");
const common_js_1 = require("./common.js");
const { hasOwnProperty } = Object.prototype;
/**
 * 定义对象结构体中的可选属性，接收任意数据类型，表示 optional() 返回值关联的属性为可选属性
 * 通常用于将对象和数组包装为可选
 */
function optional(node) {
    const newNode = { [common_js_1.indexKey]: node };
    Object.defineProperty(newNode, common_js_1.optionalKey, { value: node });
    return newNode;
}
exports.optional = optional;
/**
 * 将传入结构体对象内的所有属性全部定义为可选
 */
function partial(node) {
    const newNode = {};
    for (const name in node) {
        const subNode = node[name];
        if (subNode && hasOwnProperty.call(subNode, common_js_1.optionalKey)) {
            newNode[name] = subNode;
        }
        else {
            newNode[name] = { [common_js_1.optionalKey]: subNode };
        }
    }
    return newNode;
}
exports.partial = partial;
/**
 * 对象必选属性，将所有可选属性转为必选类型
 */
function required(node) {
    const newNode = {};
    for (const name in node) {
        const subNode = node[name];
        if (subNode && hasOwnProperty.call(subNode, common_js_1.optionalKey)) {
            newNode[name] = subNode[common_js_1.optionalKey];
        }
        else {
            newNode[name] = subNode;
        }
    }
    return newNode;
}
exports.required = required;
/**
 * 从已有模型中选取属性，创建新的模型
 */
function pick(node, ...keys) {
    const newNode = {};
    for (const key of keys) {
        if (hasOwnProperty.call(node, key)) {
            newNode[key] = node[key];
        }
        else {
            throw new Error(`pick(node) 中 ${key} 属性不存在`);
        }
    }
    return newNode;
}
exports.pick = pick;
/**
 * 对象省略类型
 * @param node schema 节点
 * @param keys 忽略属性名
 * @returns
 */
function omit(node, ...keys) {
    const newNode = Object.assign({}, node);
    for (const key of keys) {
        delete newNode[key];
    }
    return newNode;
}
exports.omit = omit;
/**
 * 联合类型
 * @param nodes 指定多个可选类型，顺序匹配其中的一个类型
 */
function union(...nodes) {
    const newNode = {
        [common_js_1.methodKey](options, value) {
            let errorInfo = '';
            for (const item of nodes) {
                const { error, data } = (0, router_js_1.entry)(item, value);
                if (error) {
                    errorInfo = error;
                }
                else {
                    return { data };
                }
            }
            return { error: `${errorInfo}，联合类型匹配失败` };
        },
        [Symbol.iterator]() {
            return {
                end: false,
                next() {
                    if (this.end) {
                        this.end = false;
                        return { done: true };
                    }
                    else {
                        this.end = true;
                        return { value: { [common_js_1.extensionKey]: newNode } };
                    }
                }
            };
        },
    };
    newNode[common_js_1.indexKey] = newNode;
    return newNode;
}
exports.union = union;
