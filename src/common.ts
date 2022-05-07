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

/** 字符串索引签名 */
export const $index: symbol = Symbol('index');

/** 验证方法 */
export const methodKey: symbol = Symbol('method');

/** 可选属性 key */
export const optionalKey: symbol = Symbol('optional?');

/** 选项 key */
export const optionsKey: symbol = Symbol('options');

/** 数组扩展赋值标识 */
export const extensionNode: symbol = Symbol('...array');

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
