import test from 'jtm';
import { Schema, Utility, string, number } from 'typea';
const { pick } = Utility;
test("pick", t => {
    const sample = {
        nane: 'lili',
        list: [12, true, true, 100],
        // age: 10,
        // data: { value: 1 }
    };
    const struct = {
        nane: string,
        list: [number, Boolean, Boolean, number],
        age: number,
        data: { value: 1 },
    };
    const schema = new Schema(pick(struct, 'nane', 'list'));
    const { error, data } = schema.verify(sample);
    t.deepEqual(data, sample, error);
});
