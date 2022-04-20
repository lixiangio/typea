import { actionKey, extensionKey } from './common.js';
/**
 * 类型扩展数据包装器，仅适用于在数组结构内使用，作用是将对象、数组结构标记为可迭代状态
 */
export declare function iterator(node: object): {
    [extensionKey]: boolean;
    node: object;
};
/**
 * 联合类型
 * @param types
 */
export declare function union(...types: any[]): {
    [actionKey]: {
        action(_: any, value: any): {
            data: any;
            error?: undefined;
        } | {
            error: string;
            data?: undefined;
        };
    };
};
/**
 * 可选属性，表示 optional() 返回值关联的属性为可选属性，接受任意数据类型
 */
export declare function optional(node: any, options?: any): any;
/**
 * 对象内可选属性，表示传入的对象内的属性为可选，仅接受对象结构
 */
export declare function partial(node: object | any[]): {};
/**
 * 必选类型，将可选类型转为必选类型
 */
export declare function required(node: object): {};
/**
 * 选择类型，通过一个模型中选取属性，创建新的模型
 * @returns
 */
export declare function pick(node: object, ...keys: string[]): {};
/**
 * 省略类型
 * @returns
 */
export declare function omit(node: object, ...keys: string[]): {};
declare const _default: {
    iterator: typeof iterator;
    union: typeof union;
    optional: typeof optional;
    partial: typeof partial;
    required: typeof required;
    pick: typeof pick;
    omit: typeof omit;
};
export default _default;
