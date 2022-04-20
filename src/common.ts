export interface Options {
  default?: any
  optional?: boolean
  set?(data: unknown): unknown
  [name: string | symbol]: unknown
}

/** 字符串索引签名 */
export const $string = Symbol('stringKey');

/** 可选属性 key */
export const actionKey = Symbol('actionKey');

/** 可选属性 key */
export const optionalKye = Symbol('optionalKye');

/** 数组扩展 key */
export const extensionKey = Symbol('extensionKey');
