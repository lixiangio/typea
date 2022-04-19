import { typeKey, extensionKey } from './common.js';
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
declare function action(options: Options, data: any): {
    data: any;
    error?: undefined;
} | {
    error: string;
    data?: undefined;
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
    [x: symbol]: {
        action: typeof action;
        methods: Methods;
    } | typeof iteratorMethod;
    [typeKey]: {
        action: typeof action;
        methods: Methods;
    };
    options: Options;
};
export {};
