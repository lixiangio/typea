"use strict"

const test = require('jmr')
const { typea } = test;

test("strict", t => {

   const sample = {
      a: "888",
      b: ["kkk", "xxx"],
      c: "666",
      d: {
         s: 0
      }
   }

   const { error, data } = typea({
      a: {
         type: String,
         allowNull: false,
      },
      b: [String, String],
      c: {
         type: String
      },
      d: {
         s: Number
      }
   }).strictVerify(sample);

   // console.log(data);

   t.deepEqual(sample, data, error);

});


test("loose", t => {

   const sample = {
      a: "888",
      b: ["kkk", "xxx"],
      c: "666",
      d: {
         s: "x"
      }
   }

   const { error, data } = typea({
      a: {
         type: String,
         allowNull: false,
         default: 'xxx',
      },
      b: [String],
      c: {
         type: String
      },
      d: {
         s: String
      }
   }).looseVerify(sample);

   // console.log(data);

   t.deepEqual(sample, data, error);

});