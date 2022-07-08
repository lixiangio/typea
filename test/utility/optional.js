import test from 'jtm';
import { Schema, Utility } from 'typea';
const { optional } = Utility;
const schema = new Schema({
    data: optional({
        name: String,
        value: {}
    })
});
test("optional", t => {
    const sample = {
        data: {
            name: '123',
            value: {}
        }
    };
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
test("optional null", t => {
    const sample = {};
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
