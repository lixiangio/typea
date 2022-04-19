import { entry } from './router.js';
import { typeKey, $index } from './common.js';
import addType from './addType.js';
import utility from './utility.js';
import './types.js';
/**
 * @param schema 验证表达式
 */
export default function typea(schema) {
    // chema 静态检查、优化
    return {
        /**
         * @param data 需要验证的数据
         */
        verify(data) {
            const result = entry(schema, data);
            if (result.error) {
                const [point] = result.error;
                if (point === '.') {
                    return { error: result.error.slice(1) };
                }
                else {
                    return { error: result.error };
                }
            }
            else {
                return { data: result.data };
            }
        }
    };
}
typea.typeKey = typeKey;
typea.$index = $index;
Object.assign(typea, utility);
/**
 * 添加自定义数据类型
 * @param name 数据类型名称
 * @param methods 扩展方法
 */
typea.add = function (name, methods) {
    if (typeof name !== 'string')
        return;
    const typeFn = typea[name];
    // 扩展已添加的类型函数
    if (typeFn) {
        Object.assign(typeFn[typeKey], methods);
    }
    // 创建新的类型函数
    else {
        addType(name, methods);
    }
};
