var data = { name: "" };
var arr = [{ name: 222 }, { name: 333 }];
observe(data);
observe(arr);
arr[0].name = 123;
data.name = "1111"; // 监听到值变化了 kindeng --> dmq

function observe(data) {
    if (Array.isArray(data)) {
        this.observeArray(data);
    } else {
        this.walk(data);
    }
}
function walk(data) {
    // 取出所有属性遍历
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
}
function observeArray(data) {
    // 数组遍历
    for (let i = 0, l = data.length; i < l; i++) {
        observe(data[i]);
    }
}

function defineReactive(data, key, val) {
    observe(val); // 监听子属性
    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: false, // 不能再define
        get: function() {
            return val;
        },
        set: function(newValue) {
            console.log(val, " --> ", newValue);
            val = newValue;
        }
    });
}
