import test from 'jtm'

const { types } = test;

test('function', t => {

   function func() { }

   const { error, data } = types(Function).verify(func);

   // console.log(data);

   t.deepEqual(func, data, error);

});


test('inline', t => {

   const sample = {
      a(x, y) {
         return [x, y]
      },
      b(a, b) {
         return a + b
      },
   }

   const { error, data } = types({
      a: Function,
      b: {
         type: Function,
         set(func) {
            return func(1, 1)
         }
      },
   }).verify(sample);

   // console.log(data);

   t.deepEqual({
      a: sample.a,
      b: 2,
   }, data, error, data);

});