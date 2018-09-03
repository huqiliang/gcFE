console.log('xez学习')
console.log('=========================')

// 定义一个类
let Person = function(o) {
  if (!o) {
    throw 'args null'
  }

  console.log('遍历所有的属性key')
  Object.keys(o).forEach(function(key) {

    // 对每个属性进行劫持
    Object.defineProperty(o, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        // 这块有疑问
        // this_value 只能存储一个属性指
        // 1 怎么分别存储所有属性的值
        console.log('get被触发')
        return this._value
      },
      set: function(newVal) {
        console.log('set被触发')
        this._value = newVal
      }
    })
  })

  return o
}

// 实例化一个对象
var a = new Person({
  data: 'data',
  name: 'name'
})

// 这块有疑问
// 1 无法劫持获取默认值 
// this_value 只有被set后才会有值，有什么办法返回默认值呢？
console.log(a.data) // undefined

// 测试
a.data = 'newdata'
console.log(a.data) // newdata


// Vue的还没有结合使用
