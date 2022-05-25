import { entry } from './router.js';
import { $index } from './common.js';
import * as baseTypes from './types.js';
import { Base } from './createType.js';
export * from './common.js';
export * from './types.js';
export { $index };
export function Schema(node) {
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
export const types = { ...baseTypes };
export function createType(name, methods) {
    if (typeof name !== 'string') {
        throw new Error(`name 参数必须为 string 类型`);
    }
    const type = Base(name, methods);
    return types[name] = type;
}
function typea(node) { return Schema(node); }
;
typea.add = createType;
export default typea;
