import { entry } from './router.js';
import { methodKey, optionalKey, $index, enumerableIterator } from './common.js';
const { hasOwnProperty } = Object.prototype;
export function optional(node) {
    const newNode = {};
    Object.defineProperty(newNode, optionalKey, { value: node });
    Object.defineProperty(newNode, $index, { value: node, enumerable: true });
    return newNode;
}
export function partial(node) {
    const newNode = {};
    for (const name in node) {
        const subNode = node[name];
        if (subNode && hasOwnProperty.call(subNode, optionalKey)) {
            newNode[name] = subNode;
        }
        else {
            newNode[name] = { [optionalKey]: subNode };
        }
    }
    return newNode;
}
export function required(node) {
    const newNode = {};
    for (const name in node) {
        const subNode = node[name];
        if (subNode && hasOwnProperty.call(subNode, optionalKey)) {
            newNode[name] = subNode[optionalKey];
        }
        else {
            newNode[name] = subNode;
        }
    }
    return newNode;
}
export function pick(node, ...keys) {
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
export function omit(node, ...keys) {
    const newNode = { ...node };
    for (const key of keys) {
        delete newNode[key];
    }
    return newNode;
}
export function union(...nodes) {
    const newNode = {};
    Object.defineProperty(newNode, methodKey, {
        value(options, value) {
            let errorInfo = '';
            for (const item of nodes) {
                const { error, data } = entry(item, value);
                if (error) {
                    errorInfo = error;
                }
                else {
                    return { data };
                }
            }
            return { error: `${errorInfo}，联合类型匹配失败` };
        }
    });
    enumerableIterator(newNode, newNode);
    return newNode;
}
