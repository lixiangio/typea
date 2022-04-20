import { entry } from './router.js';
import { actionKey, $string } from './common.js';
import addType, { type Methods } from './addType.js';
import * as types from './types.js';
export * from './common.js';
export * from './types.js';

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

typea.$string = $string;
typea.actionKey = actionKey;

Object.assign(typea, types);

/**
 * 添加自定义数据类型
 * @param name 数据类型名称
 * @param methods 扩展方法
 */
typea.add = function (name: string, methods: Methods): void {

  if (typeof name !== 'string') return;

  const typeFn = typea[name];

  // 扩展已添加的类型函数
  if (typeFn) {

    Object.assign(typeFn[actionKey], methods);

  }

  // 创建新的类型函数
  else {

    typea[name] = addType(methods);

  }

}
