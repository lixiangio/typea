import Parser from './parser.js';
import { types, type, type Options } from './types.js';

/**
 * @param schema 验证表达式
 */
function typea(schema: any) {

  // schema 静态校验、优化

  return {
    /**
     * 常规模式，allowNull 值为 true 时强制验证
     * @param data 需要验证的数据
     */
    verify(data: any) {

      const parser = new Parser();
      return parser.verify(undefined, data, schema);

    }
  };

}


/**
 * 添加自定义数据类型
 * @param name 数据类型名称
 * @param methods 扩展方法
 */
typea.add = function (name: string, methods: object): void {

  // 通过String定位，扩展已有数据类型或创建新类型
  if (typeof name !== 'string') return;

  const extendFn = typea[name];

  // 扩展已添加的类型
  if (extendFn) {

    const _methods = extendFn[type];
    Object.assign(_methods, methods);

  }

  // 创建新类型
  else {

    function extend(options: Options) {
      return { [type]: methods, options };
    }

    extend[type] = methods;

    typea[name] = extend;

  }

}

Object.assign(typea, types);

export default typea;
