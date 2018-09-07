class Observer {
    constructor(value) {
        this.value = value

        // observeArray
        if (Array.isArray(value)) {
            this.observeArray(value)
        } else {
            this.walk (value)
        }
    }

    observeArray(items) { // 观察数组中的每一项
        for (let i = 0, l = items.length; i < l; i++) {
            new Observer(items[i])
        }
    }
    //只有当value类型是object时才调用
    walk(obj) {
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}

function defineReactive(obj, key, val) {
    let property  = Object.getOwnPropertyDescriptor(obj, key)

    //当属性不可配置时返回
    if (property  && property.configurable === false) return

    // 获得预定义的getter/setter
    const getter = property && property.get
    const setter = property && property.set
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }

    let childOb = new Observer(val)
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get() {
            const value = getter ? getter.call(obj) : val//先调用默认的get方法取
           
            return value
       },
        set(newVal) {
            const value = getter ? getter.call(obj) : val
            //当修改的值等于原来的值或传入无效值返回
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }

            console.log(`劫持了${value}=>${newVal}`)

            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = new Observer(newVal)
        }
    })
}

// 测试

let data = {
    string: 'he',
    arr: ['index', {age: 12}],
    obj: {a: [2, 3]}
}

new Observer(data)

console.log(data.string) // 'he'

data.string = 'she' // 劫持了he=>she

console.log(data.string) // she

console.log(data.arr[1]) // {age: 12}

data.arr[1].age = 14 //劫持了12=>14

console.log(data.arr[1])

data.obj.a.push(4)
console.log(data.obj.a)

let array = [{name: 'zz'}, {age: 1}]

new Observer(array)

array[0].name = 'bb' //劫持了zz=>bb
