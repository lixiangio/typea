import { entry } from './router.js';
import type { Methods, Return } from './common.js';
import types from './types.js';
import { Type } from './createType.js';

export * from './common.js';
export * from './types.js';
export * as Utility from './utility.js';

class Schema {
  static types = types
  node: any
  constructor(node: any) {

    this.node = node;

  }
  /**
   * @param entity 需要验证的数据
   */
  verify(entity: any): Return {

    const result = entry(this.node, entity);

    if (result.error) {
      const [point] = result.error;
      if (point === '.') {
        return { error: result.error.slice(1) };
      } else {
        return { error: result.error };
      }
    } else {
      return { data: result.data };
    }

  }
}

export { Schema, types };

/**
 * 添加自定义数据类型
 * @param name 数据类型名称
 * @param methods 扩展方法
 */
export function createType(name: string, methods: Methods) {

  if (typeof name !== 'string') {
    throw new Error(`name 参数必须为 string 类型`);
  }

  return types[name] = Type(name, methods);

}

export default Schema;