interface type {
  /**
   * 常规模式，allowNull值为true时强制验证
   * @param {object} extend 数据扩展选项
   */
  verify(data: any, extend: object)

  /**
   * 严格模式
   * 禁止所有空值，有值验证，无值报错
   * @param {object} extend 数据扩展选项
   */
  strictVerify(data: any, extend: object)

  /**
   * 宽松模式
   * 忽略所有空值，有值验证，无值跳过，忽略allowNull属性
   * @param {object} extend 数据扩展选项
   */
  looseVerify(data: any, extend: object)
}

export interface Typea {
  (express: any): type
  use(type: string | number, options: object): void
  types: object
}

declare module 'typea' {
  
}
