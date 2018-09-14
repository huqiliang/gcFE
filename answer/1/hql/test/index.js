import Wue from "../src/index";

var vm = new Wue({
  data: {
    a: {
      b: 100,
      c: {
        d: "dd"
      }
    },
    d: "D",
    arr: [1, 2, 3]
  }
});
vm.$data.a.c.d = "100";
vm.$data.a.c = "dd";
console.log(vm.$data.a.b);
vm.$data.a = "111";
vm.$data.b = 200;
vm.$data.arr.push(100);
console.log(vm.$data.a);
