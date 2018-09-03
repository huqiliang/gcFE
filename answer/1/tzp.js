var hasProto = '__proto__' in {};
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

function protoAugment(target, src) {
  target.__proto__ = src;
}

function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}

function def(obj, key, val, enumerable = false) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
  // 获取原始的数组操作方法
  var original = arrayProto[method];
  // 在 arrayMethods 上新建属性 method，并为 method 指定值（函数）
  // 即改写 arrayMethods 上的同名数组方法
  def(arrayMethods, method, function mutator() {
    var arguments$1 = arguments;
 
    var i = arguments.length;
    var args = new Array(i);
    // 将伪数组 arguments 转变为数组形式
    while(i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var inserted;
    // 对几个可能有新增元素的方法单独考虑
    switch(method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // splice 方法第三个参数开始才是新增的元素
        inserted =args.slice(2);
        break;
    }
    return result;
  });
});
 
var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

class Observer {
    constructor(value) {
    	//debugger
        this.value = value;
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
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
        	//对对象的每个键值进行监听
            defineReactive(obj, keys[i]);
        }
    }
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
        	//对数组中的每一项在建立观察者的实例
            new Observer(items[i]);
        }
    }
}

function defineReactive(obj, key, val) {
    const property = Object.getOwnPropertyDescriptor(obj, key);
    //排除不是自身属性并且不可重新定义的键值
    if (property && property.configurable === false) {
        return
    }
    //获取对应属性的getter和setter
    const getter = property && property.get;
    const setter = property && property.set;
    //只有setter不存在getter应该为初始化赋值操作
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key];
    }
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            const value = getter ? getter.call(obj) : val;
            return value
        },
        set(newVal) {
            const value = getter ? getter.call(obj) : val;
            //数据相等或者对于NAN等特殊的情况就不处理
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
        }
    })
}

/*test*/
var testObj = {
    str: 1,
    arr: [1, 2],
    obj: {
        str: 1,
        arr: [1, 2]
    }
}
new Observer(testObj);
testObj.str;
testObj.str = 2;
testObj.arr.push(3);
testObj.obj.str;
testObj.obj.str = 2;
testObj.obj.arr.push(3);