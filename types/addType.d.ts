import { actionKey, extensionKey } from './common.js';
export interface Methods {
    [name: string]: (data: any, option?: any) => {
        error?: string;
        data?: any;
    };
}
export interface Options {
    default?: any;
    allowNull?: boolean;
    ignore?: any[];
    [name: string | symbol]: any;
}
/**
* 类型函数、类型对象参数执行器
* @param options 验证选项
* @param data 待验证数据
*/
export declare function action(options: Options, data: any): {
    error: string;
    data?: undefined;
} | {
    data: any;
    error?: undefined;
};
/**
 * 数组扩展类型迭代器
 */
declare function iteratorMethod(): {
    end: boolean;
    next(): {
        done: boolean;
        value?: undefined;
    } | {
        value: {
            [extensionKey]: boolean;
            node: any;
        };
        done?: undefined;
    };
};
/**
 * 添加数据类型声明
 * @param name 类型名称
 * @param methods 验证方法
 * @param TypeFunction 附加类型
 */
export default function (name: string, methods: Methods, TypeFunction?: Function): (options?: Options) => {
    default?: any;
    allowNull?: boolean;
    ignore?: any[];
    [actionKey]: {
        action: typeof action;
        methods: Methods;
    };
    [Symbol.iterator]: typeof iteratorMethod;
};
export {};
