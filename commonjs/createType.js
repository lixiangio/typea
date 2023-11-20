"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeBind = exports.Struct = exports.Type = void 0;
const router_js_1 = require("./router.js");
const common_js_1 = require("./common.js");
const { toString, hasOwnProperty } = Object.prototype;
/**
 * 创建数据类型函数
 * @param methods 验证方法
 */
function Type(name, methods) {
    const typeMethod = methods.type;
    /**
    * 带有可选参数的复合型校验器
    * @param options 验证选项
    * @param data 待验证数据
    */
    function method(options, data) {
        const { set, default: defaultValue } = options, other = __rest(options, ["set", "default"]);
        if (set) {
            data = set(data);
        }
        // 空值处理选项
        else if (data === undefined) {
            // 填充默认值
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
        // 执行验证选项扩展函数，将上一个函数输出结果作为下一个函数的输入参数
        for (const name in other) {
            const method = methods[name]; // 每个有效的 node[$name] 对应一个 methods[$name]() 处理函数
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
    /**
     * 类型函数
     * @param options 类型选项
     */
    function type(options) {
        const typeObject = {
            [common_js_1.indexKey]: type,
            [Symbol.iterator]() {
                return {
                    end: false,
                    next() {
                        if (this.end) {
                            this.end = false;
                            return { done: true };
                        }
                        else {
                            this.end = true;
                            return { value: { [common_js_1.extensionKey]: typeObject } };
                        }
                    }
                };
            }
        }; // 对象内可枚举属性扩展
        Object.defineProperty(typeObject, "name", { value: name });
        Object.defineProperty(typeObject, common_js_1.methodKey, { value: method });
        if (options) {
            Object.defineProperty(typeObject, common_js_1.optionsKey, { value: options });
            if (toString.call(options) === '[object Object]') {
                // 当 optional、default、set 之一存在时，转为可选属性
                if (options.set || options.default || options.optional) {
                    Object.defineProperty(typeObject, common_js_1.optionalKey, { value: typeObject });
                }
            }
        }
        return typeObject;
    }
    // @ts-ignore
    type[common_js_1.indexKey] = type; // 可扩展属性，用作泛匹配标识
    Object.defineProperty(type, "name", { value: name }); // 将函数的静态只读属性 name 值重置为对应的类型名称
    Object.defineProperty(type, common_js_1.methodKey, {
        /**
        * 无参数类型校验器，仅校验类型
        * @param _ 空位
        * @param value 待验证数据
        */
        value(_, value) {
            if (value === undefined) {
                return { error: " 值不允许为空" };
            }
            else {
                const { error, data } = typeMethod(value);
                if (error) {
                    return { error: ` ${error}` };
                }
                else {
                    return { data };
                }
            }
        }
    });
    Object.defineProperty(type, Symbol.iterator, {
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
                        return { value: { [common_js_1.extensionKey]: type } };
                    }
                }
            };
        }
    });
    // @ts-ignore
    return type;
}
exports.Type = Type;
/**
 * 创建结构，用于对象和数组
 * @param name
 * @param methods
 * @returns
 */
function Struct(name, methods) {
    const typeMethod = methods.type;
    /**
    // * 带有可选参数的复合型校验器
    // * @param options 验证选项
    // * @param data 待验证数据
    // */
    // function method(options: Options, data: any): Return {
    //   const { set, default: defaultValue, ...other } = options;
    //   if (set) {
    //     data = set(data);
    //   }
    //   // 空值处理选项
    //   else if (data === undefined) {
    //     // 填充默认值
    //     if (hasOwnProperty.call(options, 'default')) {
    //       data = defaultValue;
    //     }
    //     else {
    //       return { error: " 值不允许为空" };
    //     }
    //   }
    //   const { error } = typeMethod(data);
    //   if (error) return { error: ` ${error}` };
    //   // 执行验证选项扩展函数
    //   for (const name in other) {
    //     const method = methods[name]; // 每个有效的 node[$name] 对应一个 methods[$name]() 处理函数
    //     if (method) {
    //       const option = other[name];
    //       const { error, data: value } = method(data, option);
    //       if (error) {
    //         return { error: ` ${error}` };
    //       } else {
    //         data = value;
    //       }
    //     }
    //   }
    //   return { data };
    // }
    /**
     * 类型函数
     * @param struct 结构体
     * @param options 类型选项
     */
    function type(struct, options) {
        const typeObject = {
            [common_js_1.indexKey]: struct,
            [Symbol.iterator]() {
                return {
                    end: false,
                    next() {
                        if (this.end) {
                            this.end = false;
                            return { done: true };
                        }
                        else {
                            this.end = true;
                            return { value: { [common_js_1.extensionKey]: struct } };
                        }
                    }
                };
            }
        }; // 对象内可枚举属性扩展
        if (struct instanceof Object) {
            // 结构体验证
            Object.defineProperty(typeObject, common_js_1.methodKey, {
                value(_, data) { return (0, router_js_1.entry)(struct, data); }
            });
        }
        else {
            throw new Error(`结构体值不允许为空`);
        }
        return typeObject;
    }
    // @ts-ignore
    type[common_js_1.indexKey] = type; // 可扩展属性，用作泛匹配标识
    Object.defineProperty(type, "name", { value: name }); // 将函数的静态只读属性 name 值重置为对应的类型名称
    Object.defineProperty(type, common_js_1.methodKey, {
        /**
        * 无参数类型校验器，仅校验类型
        * @param _ 空参数
        * @param data 待验证数据
        */
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
    Object.defineProperty(type, Symbol.iterator, {
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
                        return { value: { [common_js_1.extensionKey]: type } };
                    }
                }
            };
        }
    });
    // @ts-ignore
    return type;
}
exports.Struct = Struct;
/**
 * 为基础类型添加枚举和验证器绑定
 * @param base 基础类型构造函数
 * @param type 验证类型函数
 */
function TypeBind(base, type) {
    Object.defineProperty(base, common_js_1.methodKey, { value: type[common_js_1.methodKey] });
}
exports.TypeBind = TypeBind;
