import test from 'jtm';
import { Schema, string } from 'typea';
test('null、undefined', t => {
    const sample = {
        a: undefined,
        b: ["kkk", undefined],
        c: '',
        d: null
    };
    const stringAllowNull = string({ optional: true });
    const { error } = new Schema({
        a: string({
            default: 'xxx',
            optional: true,
        }),
        b: [String, undefined],
        c: stringAllowNull,
        d: null,
        e: undefined
    }).verify(sample);
    sample.a = 'xxx';
    t.deepEqual(error, 'e 属性缺失', error);
});
test('null error', t => {
    const sample = { b: ["kkk", null] };
    const { error } = new Schema({ b: [String, undefined] }).verify(sample);
    t.deepEqual(error, 'b[1] 值必须为 undefined，实际得到 null', error);
});
test('undefined error', t => {
    const sample = { b: ["kkk"] };
    const { error } = new Schema({ b: [String, undefined] }).verify(sample);
    t.deepEqual(error, 'b[1] 属性缺失，值必须为 undefined', error);
});
