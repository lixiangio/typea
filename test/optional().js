import test from 'jtm';
import types from 'typea';

const { optional } = types;


test("optional($name)", t => {

  const sample = {
    data: {
      name: '123',
      value: {}
    }
  };

  const schema = types({
    [optional('data')]: {
      name: String,
      value: Object
    }
  });

  const { error, data } = schema.verify(sample, 'strict');

  t.deepEqual(data, sample, error);

});
