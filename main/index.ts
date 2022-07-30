import type { Methods } from './common.js';
import { Type } from './createType.js';
import types from './types.js';
import { entry } from './router.js';

export * from './common.js';
export * from './types.js';
export * as Utility from './utility.js';

interface Return {
  /** 验证失败时返回的错误信息 */
  error?: string,
  /** 验证成功时返回经过验证转换后的合规数据 */
  value?: any,
  /** 验证成功时返回经过验证转换后的合规数据，作为 value 的别名，将来可能被删除 */
  data?: any
}

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

    const { error, data } = entry(this.node, entity);

    if (error) {
      const [point] = error;
      if (point === '.') {
        return { error: error.slice(1) };
      } else {
        return { error };
      }
    } else {
      return { value: data, data };
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