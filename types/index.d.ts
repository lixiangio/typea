import { type Methods } from './addType.js';
import './types.js';
/**
 * @param schema 验证表达式
 */
declare function typea(schema: any): {
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
    var $string: typeof import("./common.js").$string;
    var actionKey: typeof import("./common.js").actionKey;
    var add: (name: string, methods: Methods) => void;
}
export default typea;
