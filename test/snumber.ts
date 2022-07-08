import test from 'jtm';
import { Schema } from 'typea';

const { snumber } = Schema.types;

test('snumber', t => {

   const sample = '12';

   const { error, data } = new Schema(snumber).verify(sample);

   t.deepEqual(data, Number(sample), error);

})

test('[snumber]', t => {

   const sample = ['20'];

   const { error, data } = new Schema([snumber]).verify(sample);

   t.deepEqual(data, [Number(sample[0])], error);

})


test('{snumber}', t => {

   const sample = { a: '12' };

   const { error, data } = new Schema({ a: snumber }).verify(sample);

   t.deepEqual(data, { a: Number(sample.a) }, error);

})
