import test from 'jtm';
import types from 'typea';

const { string } = types;

test('undefined, null', async t => {

  const sample = {
    a: undefined,
    b: ["kkk", undefined],
    c: '',
    d: null
  };

  const stringAllowNull = string({ allowNull: true })

  const { error } = types({
    a: string({
      default: 'xxx',
      allowNull: false,
    }),
    b: [String, undefined],
    c: stringAllowNull,
    d: null,
    e: undefined
  }).verify(sample, 'strict');

  sample.a = 'xxx';

  t.deepEqual(error, 'e 属性不存在', error);

});
