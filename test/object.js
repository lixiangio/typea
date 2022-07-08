import test from 'jtm';
import { Schema, Utility, object, number, string } from 'typea';
const { union } = Utility;
test('object', t => {
    const schema = new Schema({
        a: {
            a1: number({ optional: true }),
            a2: union(number, null)
        },
        b: number({
            set(data) {
                return data * 2;
            }
        }),
        f(fn, set) {
            set(fn(1, 1));
            // return { s: String, m: Number }
        },
        ...object({ a: 1, b: 2 })
    });
    const sample = {
        a: {
            a1: 1,
            a2: null,
        },
        b: 10,
        f(a, b) { return a + b; },
        o1: {
            a: 1,
            b: 2
        },
        o2: {
            a: 1,
            b: 2
        }
    };
    const { error, data } = schema.verify(sample);
    sample.b = 20;
    sample.f = 2;
    t.deepEqual(data, sample, error);
});
test('object null', async (t) => {
    const sample = {
        a: undefined,
        b: ["kkk", "xxx"],
        c: '',
        d: null
    };
    const stringAllowNull = string({ optional: true });
    const { error } = new Schema({
        a: string({
            default: 'xxx',
            optional: true,
        }),
        b: [String],
        c: stringAllowNull,
        d: null,
        e: undefined
    }).verify(sample);
    sample.a = 'xxx';
    t.deepEqual(error, 'e 属性缺失', error);
});
test('[...object]', t => {
    const schema = new Schema([...object({
            a: Number,
            b: number({ optional: true })
        })]);
    const sample = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1 }];
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
test('{...object}', t => {
    const schema = new Schema({
        ...object({
            a: Number,
            b: number({ optional: true })
        })
    });
    const sample = {
        a: { a: 1, b: 2 },
        b: { a: 2, b: 2 },
        c: { a: 1 }
    };
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
