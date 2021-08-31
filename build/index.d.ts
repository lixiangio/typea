/**
 * @param {*} express 验证表达式
 */
declare function typea(express: any): {
    /**
     * 常规模式，allowNull值为true时强制验证
     * @param {object} extend 数据扩展选项
     */
    verify(data: any, extend: object): any;
    /**
     * 严格模式
     * 禁止所有空值，有值验证，无值报错
     * @param {object} extend 数据扩展选项
     */
    strictVerify(data: any, extend: object): any;
    /**
     * 宽松模式
     * 忽略所有空值，有值验证，无值跳过，忽略allowNull属性
     * @param {object} extend 数据扩展选项
     */
    looseVerify(data: any, extend: object): any;
};
declare namespace typea {
    var types: {
        mongoId: symbol;
        mobilePhone: symbol;
        email: symbol;
    };
    var use: (type: string | number, options?: object) => void;
}
export default typea;
