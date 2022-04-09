// function index(name, type, optional) {
//   return Symbol(`INDEX:${name}<!>${type}<!>${optional}`);
// }

// console.log(index('user', 'string', "?").description);

// const o = { a: 1, c: 3, [Symbol('123')]: 2 };

// console.log( Object.getOwnPropertySymbols(o)[0].description)



// for (const name in o) {
//   console.log(typeof name)
// }

// o.string = function string() {

// }


// console.log(o.string.name)

// const map = new Map();

// map.set(String, 1)

// for (const [key, value] of map) {
//   console.log(key.name, value)
// }


const type = Symbol('type')

String[type] = {}

console.log(String)

console.log(String[type])
