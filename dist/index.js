import { entry } from './router.js';
import { $index } from './common.js';
import * as baseTypes from './types.js';
import { Type } from './createType.js';
export * from './common.js';
export * from './types.js';
export { $index };
class Schema {
    node;
    constructor(node) {
        this.node = node;
    }
    verify(data) {
        const result = entry(this.node, data);
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
}
export { Schema };
export default Schema;
export const types = { ...baseTypes };
export function createType(name, methods) {
    if (typeof name !== 'string') {
        throw new Error(`name 参数必须为 string 类型`);
    }
    const type = Type(name, methods);
    return types[name] = type;
}
