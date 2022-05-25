import test from 'jtm'
import { Schema, types } from 'typea';

const { string } = types;

test("strict", t => {

   const sample = {
      a: "888",
      b: ["kkk", "xxx"],
      c: "666",
      d: {
         s: 0
      }
   };

   const { data, error } = Schema({
      a: string({ optional: true }),
      b: [String, String],
      c: String,
      d: {
         s: Number
      }
   }).verify(sample);

   // console.log(data);

   t.deepEqual(data, sample, error);

});
