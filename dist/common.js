export const $index = Symbol('index');
export const methodKey = Symbol('method');
export const optionalKey = Symbol('optional?');
export const optionsKey = Symbol('options');
export const extensionNode = Symbol('...array');
export function enumerableIterator(target, output) {
    Object.defineProperty(target, $index, { value: output, enumerable: true });
    Object.defineProperty(target, Symbol.iterator, {
        value() {
            return {
                end: false,
                next() {
                    if (this.end) {
                        this.end = false;
                        return { done: true };
                    }
                    else {
                        this.end = true;
                        return { value: { [extensionNode]: output } };
                    }
                }
            };
        }
    });
}
