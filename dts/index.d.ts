import { type Methods } from './addType.js';
import './types.js';
/**
 * @param schema 验证表达式
 */
 export function typea(schema: any): {
    /**
     * @param data 需要验证的数据
     */
    verify(data: any): {
        error: any;
        data?: undefined;
    } | {
        data: any;
        error?: undefined;
    };
};
declare namespace typea {
    var typeKey: typeof import("./common.js").typeKey;
    var $index: typeof import("./common.js").$index;
    var add: (name: string, methods: Methods) => void;
}
export default typea;
