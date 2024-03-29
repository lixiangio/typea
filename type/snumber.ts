/** 输入 number 字符串类型，输出 number 类型 */
export default {
  type(value: string) {
    const data = Number(value);
    if (Number.isNaN(data)) {
      return { error: '值必须为 number 类型或字符串类型的数值' };
    } else {
      return { data };
    }
  }
};
