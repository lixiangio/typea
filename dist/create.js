import { methodKey, optionalKey, optionsKey, $index, enumerableIterator } from './common.js';
import { entry } from './router.js';
const { toString, hasOwnProperty } = Object.prototype;
export function Struct(name, methods) {
    const typeMethod = methods.type;
    function type(struct, options) {
        if (struct instanceof Object) {
            const typeObject = {};
            Object.defineProperty(typeObject, methodKey, {
                value(_, data) {
                    return entry(struct, data);
                }
            });
            enumerableIterator(typeObject, struct);
            return typeObject;
        }
        else {
            return type;
        }
    }
    Object.defineProperty(type, "name", { value: name });
    Object.defineProperty(type, methodKey, {
        value(_, data) {
            if (data === undefined) {
                return { error: " 值不允许为空" };
            }
            else {
                const { error } = typeMethod(data);
                if (error)
                    return { error: ` ${error}` };
            }
            return { data };
        }
    });
    enumerableIterator(type, type);
    return type;
}
export function baseTypeBind(base, type) {
    Object.defineProperty(base, methodKey, { value: type[methodKey] });
    Object.defineProperty(base, Symbol.iterator, { value: type[Symbol.iterator] });
    Object.defineProperty(base, $index, { value: type, enumerable: true });
}
export function Type(name, methods) {
    const typeMethod = methods.type;
    function method(options, data) {
        const { set, default: defaultValue, ...other } = options;
        if (set) {
            data = set(data);
        }
        else if (data === undefined) {
            if (hasOwnProperty.call(options, 'default')) {
                data = defaultValue;
            }
            else {
                return { error: " 值不允许为空" };
            }
        }
        const { error } = typeMethod(data);
        if (error)
            return { error: ` ${error}` };
        for (const name in other) {
            const method = methods[name];
            if (method) {
                const option = other[name];
                const { error, data: value } = method(data, option);
                if (error) {
                    return { error: ` ${error}` };
                }
                else {
                    data = value;
                }
            }
        }
        return { data };
    }
    function type(options) {
        if (toString.call(options) === '[object Object]') {
            const typeObject = {};
            Object.defineProperty(typeObject, "name", { value: name });
            Object.defineProperty(typeObject, methodKey, { value: method });
            Object.defineProperty(typeObject, optionsKey, { value: options });
            enumerableIterator(typeObject, typeObject);
            if (options.set || options.default || options.optional) {
                Object.defineProperty(typeObject, optionalKey, { value: typeObject });
            }
            return typeObject;
        }
        else {
            return type;
        }
    }
    Object.defineProperty(type, "name", { value: name });
    Object.defineProperty(type, methodKey, {
        value(_, data) {
            if (data === undefined) {
                return { error: " 值不允许为空" };
            }
            else {
                const { error } = typeMethod(data);
                if (error)
                    return { error: ` ${error}` };
            }
            return { data };
        }
    });
    enumerableIterator(type, type);
    return type;
}
