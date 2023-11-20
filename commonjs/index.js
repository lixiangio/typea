"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createType = exports.types = exports.Schema = exports.Utility = void 0;
const createType_js_1 = require("./createType.js");
const types_js_1 = require("./types.js");
exports.types = types_js_1.default;
const router_js_1 = require("./router.js");
__exportStar(require("./common.js"), exports);
__exportStar(require("./types.js"), exports);
exports.Utility = require("./utility.js");
class Schema {
    constructor(node) {
        this.node = node;
    }
    /**
     * @param entity 需要验证的数据
     */
    verify(entity) {
        const { error, data } = (0, router_js_1.entry)(this.node, entity);
        if (error) {
            const [point] = error;
            if (point === '.') {
                return { error: error.slice(1) };
            }
            else {
                return { error };
            }
        }
        else {
            return { value: data, data };
        }
    }
}
exports.Schema = Schema;
Schema.types = types_js_1.default;
/**
 * 添加自定义数据类型
 * @param name 数据类型名称
 * @param methods 扩展方法
 */
function createType(name, methods) {
    if (typeof name !== 'string') {
        throw new Error(`name 参数必须为 string 类型`);
    }
    return types_js_1.default[name] = (0, createType_js_1.Type)(name, methods);
}
exports.createType = createType;
exports.default = Schema;
