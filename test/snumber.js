import test from 'jtm';
import types from 'typea';

const { snumber } = types;

test('snumber', t => {

   const sample = '12';

   const { error, data } = types(snumber).verify(sample);

   t.deepEqual(data, Number(sample), error);

})

test('[snumber]', t => {

   const sample = ['20'];

   const { error, data } = types([snumber]).verify(sample);

   sample[0] = Number(sample[0]);

   t.deepEqual(data, sample, error);

})


test('{snumber}', t => {

   const sample = { a: '12' };

   const { error, data } = types({ a: snumber }).verify(sample);

   sample.a = Number(sample.a);

   t.deepEqual(data, sample, error);

})
