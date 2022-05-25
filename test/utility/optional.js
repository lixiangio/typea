import test from 'jtm';
import { Schema } from 'typea';
import { optional } from 'typea/utility';

test("optional", t => {

  const schema = Schema({
    data: optional({
      name: String,
      value: {}
    })
  });

  const sample = {
    data: {
      name: '123',
      value: {}
    }
  };

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
