import test from 'jtm'
import types from 'typea';

const { string } = types;

test("strict mode", t => {

   const sample = {
      a: "888",
      b: ["kkk", "xxx"],
      c: "666",
      d: {
         s: 0
      }
   }

   const { error, data } = types({
      a: string({ allowNull: false }),
      b: [String, String],
      c: String,
      d: {
         s: Number
      }
   }).verify(sample, 'strict');

   // console.log(data);

   t.deepEqual(sample, data, error);

});


test("loose mode", t => {

   const sample = {
      a: "888",
      b: ["kkk", "xxx"],
      c: "666",
      d: {
         s: "x"
      }
   }

   const { error, data } = types({
      a: string({
         allowNull: false,
         default: 'xxx',
      }),
      b: [String],
      c: String,
      d: {
         s: String
      }
   }).verify(sample, 'loose');

   // console.log(data);

   t.deepEqual(sample, data, error);

});