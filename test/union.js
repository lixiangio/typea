import test from 'jtm';
import types from 'typea';

const { index, optional, any, string, number, symbol, union } = types;

test("type", t => {

  const schema = types({
    nane: union(String, number, [String, number]),
    test: { name: String },
    [optional('type')]: string,
    [index(string)]: string,
    [index(number)]: number,
    [index(symbol)]: symbol,
    value: any
  });

  const sample = {
    nane: 'lili',
    value: {
      type: 1,
      count: 10
    }
  };

  const { error, data } = schema.verify(sample, 'strict');

  // console.log(data);

  t.deepEqual(sample, data, error);

});
