interface type {
  /**
   * 模式，allowNull值为true时强制验证
   * @param {object} extend 数据扩展选项
   */
  verify(data: any, mode: string)
}

export interface Typea {
  (express: any): type
  use(type: string | number, options: object): void
  types: object
}

declare module 'typea' {
  
}
