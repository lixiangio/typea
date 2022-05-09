import { entry } from './router.js';
import { Type } from './create.js';
import { $index } from './common.js';
import * as types from './types.js';
export * from './common.js';
export * from './types.js';
export { $index };
export default function typea(node) {
    return {
        node,
        verify(data) {
            const result = entry(node, data);
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
Object.assign(typea, types);
typea.add = function (name, methods) {
    if (typeof name !== 'string') {
        throw new Error(`name 参数必须为 string 类型`);
    }
    if (typea[name] === undefined) {
        typea[name] = Type(name, methods);
    }
};
