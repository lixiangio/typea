import test from 'jtm';
import types from 'typea';

test('tuple', t => {

  const { number } = types;

  const sample = {
    tuple: ["hello", 123, () => { }, function test() { }, { name: 'lili' }],
    array: [1, 2, '3']
  };

  const schema = types({
    tuple: [String, Number, Function, function () { }, { name: String }],
    array: [number({ set(v) { return Number(v) } })]
  });

  const { error, data } = schema.verify(sample);

  // 将 string 转换为 number
  sample.array[2] = Number(sample.array[2]);

  t.deepEqual(sample, data, error);

});