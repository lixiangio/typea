import { entry } from './router.js';
import { actionKey, optionalKye, extensionKey } from './common.js';
import type { Options } from './common.js';

/**
 * 类型扩展数据包装器，仅适用于在数组结构内使用，作用是将对象、数组结构标记为可迭代状态
 */
export function iterator(node: object) {
  return { [extensionKey]: true, node };
}

/**
 * 联合类型
 * @param types 
 */
export function union(...types: any[]) {

  return {
    [actionKey]: {
      action(_, value: any) {
        let errorInfo: string;
        for (const item of types) {
          const { error, data } = entry(item, value);
          if (error) {
            errorInfo = error;
          } else {
            return { data };
          }
        }
        return { error: `${errorInfo}，联合类型匹配失败` };
      }
    }
  };

}

const { hasOwnProperty } = Object.prototype;

/**
 * 可选属性，适用于任意类型，表示 optional() 返回值关联的属性为可选属性
 * 通常用于将对象和数组包装为可选
 */
export function optional(node, options?: Options) {

  return {
    [optionalKye]: true,
    ...options,
    node
  };

}

/**
 * 对象可选属性，表示传入的对象内的属性为可选，仅接受对象结构
 */
export function partial(node: object | any[]) {

  const newNode = {};

  for (const name in node) {
    newNode[name] = {
      [optionalKye]: true,
      node: node[name]
    };
  }

  return newNode;

}

/**
 * 对象必选属性，将所有可选属性转为必选类型
 */
export function required(node: object) {

  const newNode = {};

  for (const name in node) {
    const subNode = node[name];
    if (subNode && subNode[optionalKye]) {
      if (hasOwnProperty.call(subNode, 'node')) {
        newNode[name] = subNode.node;
      } else {
        newNode[name] = { ...subNode };
        delete newNode[name][optionalKye];
      }
    } else {
      newNode[name] = subNode;
    }
  }

  return newNode;

}

/**
 * 对象选择类型，从已有模型中选取属性，创建新的模型
 * @returns 
 */
export function pick(node: object, ...keys: string[]) {

  const newNode = {};

  for (const key of keys) {
    if (hasOwnProperty.call(node, key)) {
      newNode[key] = node[key];
    } else {
      throw new Error(`pick(node) 中 ${key} 属性不存在`);
    }
  }

  return newNode;

}

/**
 * 对象省略类型
 * @returns 
 */
export function omit(node: object, ...keys: string[]) {

  const newNode = { ...node };

  for (const key of keys) {
    delete newNode[key];
  }

  return newNode;

}
