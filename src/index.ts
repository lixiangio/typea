import { typeKey, addDataType, type Methods } from './types.js';
import Parser from './parser.js';

/**
 * @param schema 验证表达式
 */
export default function typea(schema: any) {

  // schema 静态检查、优化

  return {
    /**
     * 常规模式，allowNull 值为 true 时强制验证
     * @param data 需要验证的数据
     */
    verify(data: any) {

      const parser = new Parser();
      const result = parser.verify(schema, data);
      if (result.error) {
        if (result.error[0] === '.') {
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

    Object.assign(typeFn[typeKey], methods);

  }

  // 创建新的类型函数
  else {

    addDataType(name, methods);

  }

}
