import { typeKey, extensionKey, $index, symbols } from './common.js';

interface ObjectIndex { [name: string | symbol]: any }

const { toString, hasOwnProperty } = Object.prototype;

/**
 * 数据入口
 * @param data 待验证数据
 * @param node 验证表达式
 */
export function entry(node: any, data: any) {

  // node 为 object 或 array
  if (node instanceof Object) {

    const typeNode = node[typeKey];

    // node 中携带 Symbol('type')，表示类型函数或类型对象 
    if (typeNode) {

      return typeNode.action(node.options, data);

    }

    // node 为对象结构
    else if (toString.call(node) === '[object Object]') {

      if (toString.call(data) === '[object Object]') {
        return object(node, data);
      } else {
        return { error: " 值必须为 object 类型" };
      }

    }

    // node 为数组结构
    else if (Array.isArray(node)) {

      if (Array.isArray(data)) {
        return array(node, data);
      } else {
        return { error: ` 值必须为 array 类型` };
      }

    }

    // node 为函数表达式
    else if (typeof node === 'function') {

      if (typeof data === 'function') {

        node(data, (value: any) => data = value);

        return { data };

      } else {

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

/**
 * 对象结构
 * @param data 待验证数据
 * @param node 验证表达式
 */
export function object(node: ObjectIndex, data: any) {

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

  const indexSbuNode = node[$index];

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

        return { error: `.${name} 属性缺失` };

      }

    }

  }

  const result = {};

  // 混合模型验证
  for (const name in mixinNode) {

    const { error, data: value } = entry(mixinNode[name], data[name]);

    if (error) {
      return { error: `.${name}${error}` };
    } else {
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
export function array(node: any[], data: any[]) {

  const result = [];

  let index = 0;
  let iteratorError: string;

  for (const item of node) {

    if (item instanceof Object) {

      // 扩展类型对象，一对多匹配，试探性向后匹配，直至类型匹配失败或无索引
      if (item[extensionKey]) {

        let next = true;
        const subNode = item.node;

        while (next) {
          if (hasOwnProperty.call(data, index)) {
            const { error, data: subData } = entry(subNode, data[index]);
            if (error) {
              iteratorError = error;
              next = false;
            } else {
              index++;
              result.push(subData);
            }
          } else {
            next = false;
          }
        }

      }

      // 类型函数、类型对象、结构对象、结构数组，一对一匹配
      else {
        const { error, data: subData } = entry(item, data[index]);
        if (error) {
          return { "error": `[${index}]${error}` };
        } else {
          index++;
          result.push(subData);
          iteratorError = null;
        }
      }

    }

    // 字面量全等匹配
    else if (hasOwnProperty.call(data, index)) {

      if (item === data[index]) {
        index++;
        result.push(item);
        iteratorError = null;
      } else {
        return { error: `[${index}] 值必须为 ${item}，实际得到 ${data[index]}` };
      }

    } else {
      return { error: `[${index}] 属性缺失，值必须为 ${item}` };
    }

  }

  // 索引未完全匹配
  if (data.length > index) {
    if (iteratorError) {
      return { error: `[${index}]${iteratorError}` };
    } else {
      return { error: `[${index}] 超出最大索引匹配范围` };
    }
  }

  return { data: result };

}