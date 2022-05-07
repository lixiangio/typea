import type { Options } from './common.js';
interface Return {
    error?: string;
    data?: any;
}
export interface Methods {
    type(data: unknown): Return;
    [name: string]: (data: any, option?: any) => Return;
}
export interface TypeFn {
    name: string;
    (options: Options): Return;
    optionsKey: Options;
    optionalKey: unknown;
    methodKey: (node: any, data?: any) => Return;
}
export declare function Struct(name: string, methods: Methods): (struct: {} | [], options?: Options) => {};
export declare function baseTypeBind(base: Function, type: Function): void;
export declare function Type(name: string, methods: Methods): (options?: Options) => {};
export {};
