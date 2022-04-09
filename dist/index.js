import Parser from './parser.js';
import { types, type, base } from './types.js';
/**
 * @param schema 验证表达式
 */
function typea(schema) {
    // schema 预处理
    return {
        /**
         * 常规模式，allowNull 值为 true 时强制验证
         * 严格模式，禁止所有空值，有值验证，无值报错
         * 宽松模式，忽略所有空值，有值验证，无值跳过，忽略 allowNull 属性
         * @param data 需要验证的数据
         * @param mode 需要验证的数据
         */
        verify(data, mode) {
            const parser = new Parser(mode);
            return parser.recursion(mode, data, schema);
        }
    };
}
/**
 * 添加自定义数据类型
 * @param name 数据类型名称
 * @param methods 扩展方法
 */
typea.add = function (name, methods) {
    // 通过String定位，扩展已有数据类型或创建新类型
    if (typeof name !== 'string')
        return;
    const extendFn = typea[name];
    // 扩展已添加的类型
    if (extendFn) {
        const _methods = extendFn[type];
        Object.assign(_methods, methods);
    }
    // 创建新类型
    else {
        Object.assign(methods, base);
        function extend(options) {
            return { [type]: methods, options };
        }
        extend[type] = methods;
        typea[name] = extend;
    }
};
Object.assign(typea, types);
export default typea;
