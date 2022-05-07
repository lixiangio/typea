import { $index } from './common.js';
import type { Methods } from './create.js';
export * from './common.js';
export * from './types.js';
export { $index };
declare function typea(schema: any): {
    verify(data: any): {
        error: any;
        data?: undefined;
    } | {
        data: any;
        error?: undefined;
    };
};
declare namespace typea {
    var add: (name: string, methods: Methods) => void;
}
export default typea;
