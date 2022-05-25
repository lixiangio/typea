/** 字符串索引签名 */
export const $index = Symbol('index');

/** 验证方法 */
export const methodKey = Symbol('method');

/** 可选属性 key */
export const optionalKey = Symbol('optional?');

/** 选项 key */
export const optionsKey = Symbol('options');

/** 数组扩展赋值标识 */
export const extensionNode = Symbol('...array');

export interface Options {
  /** 默认值 */
  default?: any
  /** 可选属性 */
  optional?: boolean
  /** set 赋值函数 */
  set?(data: unknown): unknown
  /** 其它扩展选项 */
  [name: string | symbol]: unknown
}

export interface Return {
  error?: string, data?: any
}

export interface Methods {
  type(data: unknown): Return
  [name: string]: (data: any, option?: any) => Return
}

export interface ExtensionObject { [name: string]: any }

export interface ExtensionNode { [name: string | number]: any }

export interface TypeObject {
  /** 类型名称 */
  name?: string
  /** 类型选项 */
  optionsKey?: Options
  /** 可选属性节点 */
  optionalKey?: unknown
  /** 执行方法函数 */
  methodKey?: (node: any, data?: any) => Return
}

export interface TypeFn {
  (options?: Options): TypeFn | TypeObject
  /** 类型名称 */
  name?: string
  /** 执行方法函数 */
  methodKey?: (node: any, data?: any) => Return
  [$index]?: () => TypeFn
  [Symbol.iterator]?: {
    value: () => {
      end: boolean,
      next: () => {}
    }
  }
  /** 数组扩展迭代器 */
  // [iterator: symbol]: () => { [extensionNode: symbol]: TypeFn }
  // /** 对象扩展枚举 */
  // [name: string]: unknown
}

/**
 * 为类型添加扩展赋值功能
 * @param target 
 * @param output 扩展赋值输出
 */
export function enumerableIterator(target: object, output: unknown) {

  Object.defineProperty(target, $index, { value: output, enumerable: true });  // 对象内可枚举扩展属性

  // 数组扩展类型迭代器
  Object.defineProperty(target, Symbol.iterator, {
    value() {
      return {
        end: false,
        next() {
          if (this.end) {
            this.end = false;
            return { done: true };
          } else {
            this.end = true;
            return { value: { [extensionNode]: output } };
          }
        }
      };
    }
  });

}
