import test from 'jtm';
import { Schema, any } from 'typea';
test('any', t => {
    const sample = {
        x: 123,
        y: '',
    };
    const schema = new Schema(any);
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
test('any[]', t => {
    const sample = [{
            x: 123,
            y: '',
            b: true,
            f() { }
        }];
    const schema = new Schema([...any]);
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
test('{ [name: string]: any }', t => {
    const sample = {
        x: 123,
        y: {},
    };
    const schema = new Schema({
        x: any,
        y: any
    });
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
