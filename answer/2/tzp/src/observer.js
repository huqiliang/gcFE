import Dep from "./dep";
var hasProto = "__proto__" in {};
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

function protoAugment(target, src) {
  target.__proto__ = src;
}

function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}

function def(obj, key, val, enumerable = false) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

function observe(value) {
  /*判断是否是一个对象*/
  if (!isObject(value)) {
    return;
  }
  let ob;
  /*这里用__ob__这个属性来判断是否已经有Observer实例，如果没有Observer实例则会新建一个Observer实例并赋值给__ob__这个属性，如果已有Observer实例则直接返回该Observer实例*/
  if (value.hasOwnProperty("__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
  function(method) {
    // 获取原始的数组操作方法
    var original = arrayProto[method];
    // 在 arrayMethods 上新建属性 method，并为 method 指定值（函数）
    // 即改写 arrayMethods 上的同名数组方法
    def(arrayMethods, method, function mutator() {
      var arguments$1 = arguments;
      var i = arguments.length;
      var args = new Array(i);
      // 将伪数组 arguments 转变为数组形式
      while (i--) {
        args[i] = arguments$1[i];
      }
      // 调用数组原生方法
      var result = original.apply(this, args);
      // 数组新插入的元素需要重新进行observe才能响应式
      const ob = this.__ob__;
      var inserted;
      // 对几个可能有新增元素的方法单独考虑
      switch (method) {
        case "push":
          inserted = args;
          break;
        case "unshift":
          inserted = args;
          break;
        case "splice":
          // splice 方法第三个参数开始才是新增的元素
          inserted = args.slice(2);
          break;
      }
      // dep通知所有注册的观察者进行响应式处理
      ob.dep.notify();
      return result;
    });
  }
);

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export default class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    //将Observer实例绑定到data的__ob__属性上面去
    def(value, "__ob__", this);
    //判断是否数组，如果是数组就走observeArray方法
    if (Array.isArray(value)) {
      var argument = hasProto ? protoAugment : copyAugment;
      //如果支持__proto__，劫持原型链上的方法 否则增加静态方法
      argument(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      //遍历对象
      this.walk(value);
    }
  }
  walk(obj) {
    if (!obj || typeof obj !== "object") return;
    Object.keys(obj).forEach(item => {
      const keys = Object.keys(obj);
      //对对象中的每一项在建立观察者的实例
      for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i], obj[keys[i]]);
      }
    });
  }
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      //对数组中的每一项在建立观察者的实例
      observe(items[i]);
    }
  }
}

function defineReactive(obj, key, val) {
  const property = Object.getOwnPropertyDescriptor(obj, key);
  const dep = new Dep();
  //排除是自身属性并且不可重新定义的键值
  if (property && property.configurable === false) {
    return;
  }
  //获取对应属性的getter和setter
  const getter = property && property.get;
  const setter = property && property.set;
  //只有setter不存在getter应该为初始化赋值操作
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }
  //对象的子对象递归进行observer并返回子节点的Observer对象
  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        /*进行依赖收集*/
        dep.depend();
        if (childOb) {
          /*子对象进行依赖收集，其实就是将同一个watcher观察者实例放进了两个depend中，一个是正在本身闭包中的depend，另一个是子元素的depend*/
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          /*是数组则需要对每一个成员都进行依赖收集，如果数组的成员还是数组，则递归。*/
          dependArray(value);
        }
      }
      return value;
    },
    set(newVal) {
      const value = getter ? getter.call(obj) : val;
      //数据相等或者对于NAN等特殊的情况就不处理
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 新的值需要重新进行observer，保证数据响应式
      childOb = observe(newVal);
      //通知订阅者更新
      dep.notify();
    }
  });
}
