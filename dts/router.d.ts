interface ObjectIndex {
    [name: string | symbol]: any;
}
/**
 * 数据入口
 * @param data 待验证数据
 * @param node 验证表达式
 */
export declare function entry(node: any, data: any): any;
/**
 * 对象结构
 * @param data 待验证数据
 * @param node 验证表达式
 */
export declare function object(node: ObjectIndex, data: any): any;
/**
* 数组结构
* @param data
* @param node
*/
export declare function array(node: any[], data: any[]): any;
export {};
