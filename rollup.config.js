// 在使用--watch模式下，会出现找不到es6模块的bug，暂时忽略

export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  }
};