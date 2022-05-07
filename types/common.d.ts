export interface Options {
    default?: any;
    optional?: boolean;
    set?(data: unknown): unknown;
    [name: string | symbol]: unknown;
}
export declare const $index: symbol;
export declare const methodKey: symbol;
export declare const optionalKey: symbol;
export declare const optionsKey: symbol;
export declare const extensionNode: symbol;
export declare function enumerableIterator(target: object, output: unknown): void;
