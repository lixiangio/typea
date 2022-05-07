import { methodKey, optionsKey, optionalKey, extensionNode, $index } from './common.js';
const { toString, hasOwnProperty } = Object.prototype;
export function entry(node, data) {
    if (node instanceof Object) {
        const method = node[methodKey];
        if (method) {
            return method(node[optionsKey], data);
        }
        else if (toString.call(node) === '[object Object]') {
            if (toString.call(data) === '[object Object]') {
                return object(node, data);
            }
            else {
                console.log(node);
                return { error: " 值必须为 object 类型" };
            }
        }
        else if (Array.isArray(node)) {
            if (Array.isArray(data)) {
                return array(node, data);
            }
            else {
                return { error: ` 值必须为 array 类型` };
            }
        }
        else if (typeof node === 'function') {
            if (typeof data === 'function') {
                node(data, (value) => data = value);
                return { data };
            }
            else {
                return { error: " 值必须为 function 类型" };
            }
        }
    }
    else if (data === node) {
        return { data };
    }
    else {
        return { error: ` 值必须为 ${node}，实际得到 ${data}` };
    }
}
export function object(node, data) {
    const checkNode = {}, result = {};
    for (const name in node) {
        const sub = node[name];
        if (sub && hasOwnProperty.call(sub, optionalKey)) {
            if (hasOwnProperty.call(data, name)) {
                checkNode[name] = sub[optionalKey];
            }
            else {
                const options = sub[optionsKey];
                if (options instanceof Object) {
                    if (options.set) {
                        result[name] = options.set(options.default);
                    }
                    else if (hasOwnProperty.call(options, 'default')) {
                        result[name] = options.default;
                    }
                }
            }
        }
        else if (hasOwnProperty.call(data, name)) {
            checkNode[name] = sub;
        }
        else {
            return { error: `.${name} 属性缺失` };
        }
    }
    if (hasOwnProperty.call(node, $index)) {
        const indexSbuNode = node[$index];
        for (const name in data) {
            if (hasOwnProperty.call(checkNode, name) === false) {
                checkNode[name] = indexSbuNode;
            }
        }
    }
    for (const name in checkNode) {
        const { error, data: value } = entry(checkNode[name], data[name]);
        if (error) {
            return { error: `.${name}${error}` };
        }
        else {
            result[name] = value;
        }
    }
    return { data: result };
}
export function array(node, data) {
    const result = [];
    let index = 0;
    let iteratorError;
    for (const item of node) {
        if (item instanceof Object) {
            if (hasOwnProperty.call(item, extensionNode)) {
                let next = true;
                const subNode = item[extensionNode];
                while (next) {
                    if (hasOwnProperty.call(data, index)) {
                        const { error, data: subData } = entry(subNode, data[index]);
                        if (error) {
                            iteratorError = error;
                            next = false;
                        }
                        else {
                            index++;
                            result.push(subData);
                        }
                    }
                    else {
                        next = false;
                    }
                }
            }
            else {
                const { error, data: subData } = entry(item, data[index]);
                if (error) {
                    if (hasOwnProperty.call(item, optionalKey) === false) {
                        return { "error": `[${index}]${error}` };
                    }
                }
                else {
                    index++;
                    result.push(subData);
                    iteratorError = null;
                }
            }
        }
        else if (hasOwnProperty.call(data, index)) {
            if (item === data[index]) {
                index++;
                result.push(item);
                iteratorError = null;
            }
            else {
                return { error: `[${index}] 值必须为 ${item}，实际得到 ${data[index]}` };
            }
        }
        else {
            return { error: `[${index}] 属性缺失，值必须为 ${item}` };
        }
    }
    if (data.length > index) {
        if (iteratorError) {
            return { error: `[${index}]${iteratorError}` };
        }
        else {
            return { error: `[${index}] 超出最大索引匹配范围` };
        }
    }
    return { data: result };
}
