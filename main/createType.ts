import { entry } from './router.js';
import type { TypeFn, StructFn, TypeObject, Methods, Return, Options } from './common.js';
import { methodKey, optionalKey, optionsKey, indexKey, extensionKey } from './common.js';

const { toString, hasOwnProperty } = Object.prototype;

/**
 * 创建数据类型函数
 * @param methods 验证方法
 */
export function Type(name: string, methods: Methods): TypeFn {

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
  function type(options?: Options): TypeObject {

    const typeObject: TypeObject = {
      [indexKey]: type,
      [Symbol.iterator]() {
        return {
          end: false,
          next() {
            if (this.end) {
              this.end = false;
              return { done: true };
            } else {
              this.end = true;
              return { value: { [extensionKey]: typeObject } };
            }
          }
        };
      }
    }; // 对象内可枚举属性扩展

    Object.defineProperty(typeObject, "name", { value: name });
    Object.defineProperty(typeObject, methodKey, { value: method });

    if (options) {

      Object.defineProperty(typeObject, optionsKey, { value: options });

      if (toString.call(options) === '[object Object]') {

        // 当 optional、default、set 之一存在时，转为可选属性
        if (options.set || options.default || options.optional) {
          Object.defineProperty(typeObject, optionalKey, { value: typeObject });
        }

      }

    }

    return typeObject;

  }

  // @ts-ignore
  type[indexKey] = type; // 可扩展属性，用作泛匹配标识

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

  Object.defineProperty(type, Symbol.iterator, {
    value() {
      return {
        end: false,
        next() {
          if (this.end) {
            this.end = false;
            return { done: true };
          } else {
            this.end = true;
            return { value: { [extensionKey]: type } };
          }
        }
      };
    }
  });

  // @ts-ignore
  return type;

}

/**
 * 创建结构，用于对象和数组
 * @param name 
 * @param methods 
 * @returns 
 */
export function Struct(name: string, methods: Methods): StructFn {

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
  function type(struct: object | any[], options?: Options): TypeObject {

    const typeObject: TypeObject = {
      [indexKey]: struct,
      [Symbol.iterator]() {
        return {
          end: false,
          next() {
            if (this.end) {
              this.end = false;
              return { done: true };
            } else {
              this.end = true;
              return { value: { [extensionKey]: struct } };
            }
          }
        };
      }
    }; // 对象内可枚举属性扩展

    if (struct instanceof Object) {

      // 结构体验证
      Object.defineProperty(typeObject, methodKey, {
        value(_: undefined, data: any) { return entry(struct, data); }
      });

    } else {

      throw new Error(`结构体值不允许为空`);

    }

    return typeObject;

  }

  // @ts-ignore
  type[indexKey] = type; // 可扩展属性，用作泛匹配标识

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

  Object.defineProperty(type, Symbol.iterator, {
    value() {
      return {
        end: false,
        next() {
          if (this.end) {
            this.end = false;
            return { done: true };
          } else {
            this.end = true;
            return { value: { [extensionKey]: type } };
          }
        }
      };
    }
  });

  // @ts-ignore
  return type;

}

interface CustomType extends Function {
  [methodKey]?: (node: any, data?: any) => Return
  [Symbol.iterator]?: () => {
    end: boolean,
    next: () => { done?: true, value?: any }
  }
}

interface BaseType extends Function {
  [indexKey]?: CustomType
  [methodKey]?: (node: any, data?: any) => Return
  [Symbol.iterator]?: () => {
    end: boolean,
    next: () => { done?: true, value?: any }
  }
}

/**
 * 为基础类型添加枚举和验证器绑定
 * @param base 基础类型构造函数
 * @param type 验证类型函数
 */
export function TypeBind(base: BaseType, type: CustomType) {

  Object.defineProperty(base, methodKey, { value: type[methodKey] });

}
