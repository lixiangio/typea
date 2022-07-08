/** 字符串索引签名 */
export const indexKey = Symbol('index');

/** 验证方法 */
export const methodKey = Symbol('method');

/** 可选属性 key */
export const optionalKey = Symbol('optional');

/** 选项 key */
export const optionsKey = Symbol('options');

/** 数组扩展赋值标识 */
export const extensionKey = Symbol('[...]');

export interface Options {
  /** 默认值 */
  default?: any
  /** 可选属性 */
  optional?: boolean
  /** set 赋值函数 */
  set?(data: unknown): unknown
  /** 其它扩展选项 */
  [name: string]: unknown
}

export interface Return {
  error?: string, data?: any
}

export interface Methods {
  type(data: unknown): Return
  [index: string]: ((data: any, option?: any) => Return)
}

export interface ExtensionObject { [name: string]: any }

export interface ExtensionNode { [name: string | number]: any }

export interface TypeObject {
  /** 类型名称 */
  name?: string
  /** 类型选项 */
  [optionsKey]?: Options
  /** 可选属性节点 */
  [optionalKey]?: unknown
  [indexKey]: any
  /** 执行方法函数 */
  [methodKey]?: (node: any, data?: any) => Return
  [Symbol.iterator]: () => {
    end: boolean,
    next: () => { done?: true, value?: any }
  }
  [name: string]: any
}

export interface TypeFn {
  (options?: Options): TypeObject
  /** 执行函数 */
  [methodKey]: (node: any, data?: any) => Return
  [indexKey]: this
  [Symbol.iterator]: () => {
    end: boolean,
    next: () => { done?: true, value?: any }
  }
}

export interface StructFn {
  (struct: object | any[], options?:Options): TypeObject
  /** 执行函数 */
  [methodKey]: (node: any, data?: any) => Return
  [indexKey]: this
  [Symbol.iterator]: () => {
    end: boolean,
    next: () => { done?: true, value?: any }
  }
}