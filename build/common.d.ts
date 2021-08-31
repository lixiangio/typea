/**
 * 通用验证方法
 */
declare const _default: {
    set(data: any, func: any, origin: any): {
        data: any;
    };
    value(undefined: any, data: any): {
        data: any;
    };
    and(data: any, option: any, origin: any): {
        error: string;
        data?: undefined;
    } | {
        data: any;
        error?: undefined;
    };
    or(data: any, option: any, origin: any): {
        error: string;
        data?: undefined;
    } | {
        data: any;
        error?: undefined;
    };
};
export default _default;
