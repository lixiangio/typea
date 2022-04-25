import test from 'jtm';
import types from 'typea';
import { union } from 'typea/utility';

const { string, number } = types;

test("union", t => {

  const sample = {
    nane: 'lili',
    list: [12, true, true, 100],
    age: 10,
    data: { value: 1 }
  };

  const schema = types({
    nane: union(string({ max: 10 }), number({ max: 100 }), [String, number]),
    list: [union(String, number, Boolean), Boolean, Boolean, number],
    age: union(String, number),
    data: union([Number], { value: 1 }, [1, 2, Number]),
  });

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});