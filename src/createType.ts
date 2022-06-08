import { entry } from './router.js';
import type { TypeFn, TypeObject, Methods, Return, Options } from './common.js';
import { methodKey, optionalKey, optionsKey, $index, enumerableIterator } from './common.js';

const { toString, hasOwnProperty } = Object.prototype;

/**
 * 创建数据类型函数
 * @param methods 验证方法
 */
export function Type(name: string, methods: Methods) {

  const typeMethod = methods.type;

  /**
  * 带有可选参数的复合型校验器
  * @param options 验证选项
  * @param data 待验证数据
  */
  function method(options: Options, data: any): Return {

    const { set, default: defaultValue, ...other } = options;

    if (set) {
      data = set(data);
    }

    // 空值处理选项
    else if (data === undefined) {

      // 填充默认值
      if (hasOwnProperty.call(options, 'default')) {
        data = defaultValue;
      } else {
        return { error: " 值不允许为空" };
      }

    }

    const { error } = typeMethod(data);

    if (error) return { error: ` ${error}` };

    // 执行验证选项扩展函数，将上一个函数输出结果作为下一个函数的输入参数
    for (const name in other) {

      const method = methods[name]; // 每个有效的 node[$name] 对应一个 methods[$name]() 处理函数

      if (method) {
        const option = other[name];
        const { error, data: value } = method(data, option);
        if (error) {
          return { error: ` ${error}` };
        } else {
          data = value;
        }
      }

    }

    return { data };

  }

  /**
   * 类型函数
   * @param options 类型选项
   */
  function type(options?: Options): TypeFn | TypeObject {

    if (options) {

      const typeObject: TypeObject = {}; // 对象内可枚举属性扩展

      Object.defineProperty(typeObject, "name", { value: name });
      Object.defineProperty(typeObject, methodKey, { value: method });
      Object.defineProperty(typeObject, optionsKey, { value: options });

      enumerableIterator(typeObject, typeObject);

      if (toString.call(options) === '[object Object]') {

        // 当 optional、default、set 之一存在时，转为可选属性
        if (options.set || options.default || options.optional) {
          Object.defineProperty(typeObject, optionalKey, { value: typeObject });
        }

      }

      return typeObject;

    } else {

      return type; // 无参数，返回静态类型函数

    }

  }

  Object.defineProperty(type, "name", { value: name }); // 将函数的静态只读属性 name 值重置为对应的类型名称

  Object.defineProperty(type, methodKey, {
    /**
    * 无参数类型校验器，仅校验类型
    * @param _ 空位
    * @param value 待验证数据
    */
    value(_: undefined, value: any): Return {

      if (value === undefined) {
        return { error: " 值不允许为空" };
      } else {
        const { error, data } = typeMethod(value);
        if (error) {
          return { error: ` ${error}` }
        } else {
          return { data };
        }
      }

    }
  });

  enumerableIterator(type, type);

  return type;

}


/**
 * 创建结构，用于对象和数组
 * @param name 
 * @param methods 
 * @returns 
 */
export function Struct(name: string, methods: Methods) {

  const typeMethod = methods.type;

  /**
  // * 带有可选参数的复合型校验器
  // * @param options 验证选项
  // * @param data 待验证数据
  // */
  // function method(options: Options, data: any): Return {

  //   const { set, default: defaultValue, ...other } = options;

  //   if (set) {
  //     data = set(data);
  //   }

  //   // 空值处理选项
  //   else if (data === undefined) {

  //     // 填充默认值
  //     if (hasOwnProperty.call(options, 'default')) {
  //       data = defaultValue;
  //     }

  //     else {
  //       return { error: " 值不允许为空" };
  //     }

  //   }

  //   const { error } = typeMethod(data);

  //   if (error) return { error: ` ${error}` };

  //   // 执行验证选项扩展函数
  //   for (const name in other) {
  //     const method = methods[name]; // 每个有效的 node[$name] 对应一个 methods[$name]() 处理函数
  //     if (method) {
  //       const option = other[name];
  //       const { error, data: value } = method(data, option);
  //       if (error) {
  //         return { error: ` ${error}` };
  //       } else {
  //         data = value;
  //       }
  //     }
  //   }

  //   return { data };

  // }

  /**
   * 类型函数
   * @param struct 结构体
   * @param options 类型选项
   */
  function type(struct: {} | [], options?: Options) {

    if (struct instanceof Object) {

      const typeObject = {}; // 对象内可枚举属性扩展

      // 结构体验证
      Object.defineProperty(typeObject, methodKey, {
        value(_: undefined, data: any) {
          return entry(struct, data);
        }
      });

      enumerableIterator(typeObject, struct);

      return typeObject;

    } else {

      return type; // 无参数，返回静态类型函数

    }

  }

  Object.defineProperty(type, "name", { value: name }); // 将函数的静态只读属性 name 值重置为对应的类型名称

  Object.defineProperty(type, methodKey, {
    /**
    * 无参数类型校验器，仅校验类型
    * @param _ 空参数 
    * @param data 待验证数据
    */
    value(_: undefined, data: any): Return {

      if (data === undefined) {
        return { error: " 值不允许为空" };
      } else {
        const { error } = typeMethod(data);
        if (error) return { error: ` ${error}` };
      }

      return { data };

    }
  });

  enumerableIterator(type, type);

  return type;

}

interface TypeBind {
  methodKey?: (node: any, data?: any) => Return
  [Symbol.iterator]?: {
    value: () => {
      end: boolean,
      next: () => {}
    }
  }
  [name: string | symbol]: any
}

/**
 * 为基础类型添加枚举和验证器绑定
 * @param base 基础类型构造函数
 * @param type 验证类型函数
 */
export function typeBind(base: Function, type: TypeBind) {

  Object.defineProperty(base, methodKey, { value: type[methodKey] });
  Object.defineProperty(base, Symbol.iterator, { value: type[Symbol.iterator] });
  Object.defineProperty(base, $index, { value: type, enumerable: true });

}
