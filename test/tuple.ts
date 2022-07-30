import test from 'jtm';
import { Schema, number } from 'typea';

test('tuple', t => {

  const sample = {
    tuple: ["hello", 123, () => { }, function test() { }, { name: 'lili' }],
    array: [1, 2, '3']
  };

  const schema = new Schema({
    tuple: [String, Number, Function, function () { }, { name: String }],
    array: [...number({ set(v) { return Number(v) } })]
  });

  const { error, value } = schema.verify(sample);

  // 将 string 转换为 number
  sample.array[2] = Number(sample.array[2]);

  t.deepEqual(value, sample, error);

});