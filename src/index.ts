import { entry } from './router.js';
import { Type } from './create.js';
import type { Methods } from './create.js';
import { methodKey, $index } from './common.js';
import * as types from './types.js';
export * from './common.js';
export * from './types.js';

export { $index };

/**
 * @param schema 验证表达式
 */
export default function typea(schema: any) {

  // chema 静态检查、优化

  return {
    /**
     * @param data 需要验证的数据
     */
    verify(data: any) {

      const result = entry(schema, data);

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
  };

}

Object.assign(typea, types);

/**
 * 添加自定义数据类型
 * @param name 数据类型名称
 * @param methods 扩展方法
 */
typea.add = function (name: string, methods: Methods): void {

  if (typeof name !== 'string') {
    throw new Error(`name 参数必须为 string 类型`);
  }

  const typeFn = typea[name];

  // 扩展已添加的类型函数
  if (typeFn) {

    Object.assign(typeFn[methodKey], methods);

  }

  // 创建新的类型函数
  else {

    typea[name] = Type(name, methods);

  }

}
