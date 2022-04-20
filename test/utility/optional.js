import test from 'jtm';
import types from 'typea';
import { optional } from 'typea/utility';

test("optional", t => {

  const sample = {
    data: {
      name: '123',
      value: {}
    }
  };

  const schema = types({
    data: optional({
      name: String,
      value: Object
    })
  });

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
