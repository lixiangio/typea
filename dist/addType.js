import { actionKey, optionalKye, extensionKey } from './common.js';
const { hasOwnProperty } = Object.prototype;
/**
* 类型函数、类型对象参数执行器
* @param options 验证选项
* @param data 待验证数据
*/
export function action(options, data) {
    if (options) {
        const { set, default: defaultValue, ...other } = options;
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
        const { methods } = this;
        const { error } = methods.type(data);
        if (error)
            return { error: ` ${error}` };
        // 执行验证选项扩展函数
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
    else {
        if (data === undefined) {
            return { error: " 值不允许为空" };
        }
        else {
            const { error } = this.methods.type(data);
            if (error)
                return { error: ` ${error}` };
        }
        return { data };
    }
}
/**
 * 数组扩展类型迭代器
 */
function iteratorMethod() {
    const node = this;
    return {
        end: false,
        next() {
            if (this.end) {
                this.end = false;
                return { done: true };
            }
            else {
                this.end = true;
                return { value: { [extensionKey]: true, node } };
            }
        }
    };
}
export function baseBind(Base, type) {
    Base[actionKey] = type[actionKey];
    Base[Symbol.iterator] = iteratorMethod;
}
/**
 * 添加数据类型声明
 * @param name 类型名称
 * @param methods 验证方法
 * @param TypeFunction 附加类型
 */
export default function (methods) {
    const actionNode = { methods, action };
    function type(options) {
        if (options) {
            if (options.optional || options.default || options.set) {
                options[optionalKye] = true;
            }
        }
        return {
            [actionKey]: actionNode,
            [Symbol.iterator]: iteratorMethod,
            ...options
        };
    }
    type[actionKey] = actionNode;
    type[Symbol.iterator] = iteratorMethod;
    return type;
}
