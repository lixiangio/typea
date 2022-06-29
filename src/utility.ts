import { entry } from './router.js';
import { methodKey, optionalKey, $index, enumerableIterator } from './common.js';
import type { ExtensionNode } from './common.js';

const { hasOwnProperty } = Object.prototype;

/**
 * 定义对象结构体中的可选属性，接收任意数据类型，表示 optional() 返回值关联的属性为可选属性
 * 通常用于将对象和数组包装为可选
 */
export function optional(node: unknown) {

  const newNode = {};

  Object.defineProperty(newNode, optionalKey, { value: node });
  Object.defineProperty(newNode, $index, { value: node, enumerable: true });

  return newNode;

}

/**
 * 将传入结构体对象内的所有属性全部定义为可选
 */
export function partial(node: ExtensionNode) {

  const newNode: ExtensionNode = {};

  for (const name in node) {
    const subNode = node[name];
    if (subNode && hasOwnProperty.call(subNode, optionalKey)) {
      newNode[name] = subNode;
    } else {
      newNode[name] = { [optionalKey]: subNode };
    }
  }

  return newNode;

}

/**
 * 对象必选属性，将所有可选属性转为必选类型
 */
export function required(node: ExtensionNode) {

  const newNode: ExtensionNode = {};

  for (const name in node) {
    const subNode = node[name];
    if (subNode && hasOwnProperty.call(subNode, optionalKey)) {
      newNode[name] = subNode[optionalKey];
    } else {
      newNode[name] = subNode;
    }
  }

  return newNode;

}

/**
 * 从已有模型中选取属性，创建新的模型
 */
export function pick(node: ExtensionNode, ...keys: string[]) {

  const newNode: ExtensionNode = {};

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
 * @param node schema 节点
 * @param keys 忽略属性名
 * @returns 
 */
export function omit(node: object, ...keys: string[]) {

  const newNode: ExtensionNode = { ...node };

  for (const key of keys) {
    delete newNode[key];
  }

  return newNode;

}


/**
 * 联合类型
 * @param nodes 指定多个可选类型，顺序匹配其中的一个类型
 */
export function union(...nodes: unknown[]) {

  const newNode = {};

  Object.defineProperty(newNode, methodKey, {
    value(options: undefined, value: any) {
      let errorInfo = '';
      for (const item of nodes) {
        const { error, data } = entry(item, value);
        if (error) {
          errorInfo = error;
        } else {
          return { data };
        }
      }
      return { error: `${errorInfo}，联合类型匹配失败` };
    }
  });

  enumerableIterator(newNode, newNode);

  return newNode;

}
