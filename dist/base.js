/**
 * 通用验证方法
 */
export default {
    // 参数自定义转换方法
    set(data, fn, _this) {
        return { data: fn.call(_this, data) };
    },
    // 直接赋值（覆盖原来的值）
    value(_, data) {
        return { data };
    },
    // 与关联属性验证
    and(data, option, _this) {
        // option 为函数时先执行函数，将函数转为数组表达式
        if (option instanceof Function) {
            option = option.call(_this, data);
        }
        // 数组表达式
        if (option instanceof Array) {
            for (const name of option) {
                if (_this[name] === undefined || _this[name] === '') {
                    return { error: `必须与${name}参数同时存在` };
                }
            }
        }
        return { data };
    },
    // 或关联属性验证
    or(data, option, _this) {
        // 如果 option 为函数，应先执行函数，将函数转为数组
        if (option instanceof Function) {
            option = option.call(_this, data);
        }
        if (option instanceof Array) {
            let status = true;
            for (const name of option) {
                if (_this[name] !== undefined && _this[name] !== '') {
                    status = false;
                }
            }
            if (status) {
                return { error: `必须至少与[${option}]参数中的一个同时存在` };
            }
        }
        return { data };
    }
};
