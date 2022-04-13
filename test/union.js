import test from 'jtm';
import types from 'typea';

const { string, number, union } = types;

test("union", t => {

  const schema = types({
    nane: union(string({ max: 3 }), number({ max: 100 }), [String, number]),
    list: [union(String, number, Boolean), Boolean, Boolean, number],
  });

  const sample = { nane: 'lili' };

  const { error, data } = schema.verify(sample, 'strict');

  t.deepEqual(data, sample, error);

});
