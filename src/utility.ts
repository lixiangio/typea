import { entry } from './router.js';
import { typeKey, symbols, extensionKey } from './common.js';

const { hasOwnProperty } = Object.prototype;

// 可选属性
export function $(name: string) {
  const symbol = Symbol('optional');
  symbols[symbol] = name;
  return symbol;
}

/**
 * 类型扩展数据包装器，仅适用于在数组结构内使用，将对象、数组结构标记为可迭代状态
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
    [typeKey]: {
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
        return { error: `${errorInfo}，联合类型匹配失败` }
      }
    }
  };

}

/**
 * 可选属性类型
 */
export function partial(node: object) {
  const newNode = {};
  for (const name in node) {
    newNode[$(name)] = node[name];
  }
  return newNode;
}

/**
 * 必选类型，将可选类型转为必选类型
 */
export function required(node: object) {

  const newNode = { ...node };
  const symbolKeys = Object.getOwnPropertySymbols(node);

  for (const symbol of symbolKeys) {

    // 可选属性，仅当数据中属性名称存在时才参与校验
    if (symbol.description === 'optional') {

      const name = symbols[symbol];
      newNode[name] = node[symbol];
      delete newNode[symbol];

    }

  }

  return newNode;

}

/**
 * 选择类型，通过一个模型中选取属性，创建新的模型
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
 * 省略类型
 * @returns 
 */
export function omit(node: object, ...keys: string[]) {
  const newNode = { ...node };
  for (const key of keys) {
    delete newNode[key];
  }
  return newNode;
}

export default {
  $, iterator, union, partial, required, pick, omit
};
