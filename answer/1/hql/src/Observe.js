import _ from "lodash";
export default class Observe {
  constructor(data) {
    _.map(data, (val, key) => {
      data[key] = this.observe(data[key]); // 递归代理
    });

    return this.proxy(data);
  }
  observe(data) {
    if (!data || typeof data !== "object") return data; // 如果不是对象直接返回值
    return new Observe(data); // 对象调用Observe
  }
  proxy(data) {
    let once = false;
    return new Proxy(data, {
      get(target, key) {
        console.log(`============get key:" ${key} "========================`);
        return Reflect.get(target, key);
      },
      set(target, key, value) {
        console.log(
          `===============set key:" ${key} " to value:" ${value} "=====================`
        );
        if (!once) {
          return Reflect.set(target, key, value);
          once = true;
          //TODO 通知视图层更新
        }
      }
    });
  }
}
