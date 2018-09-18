import _ from "lodash";
import observe from "./Observe";

export default class Wue {
  constructor(options) {
    //拦截数据
    //使用es6 proxy observe 传入的数据
    const { data } = options;
    if (_.isFunction(data)) {
      const data = data();
      this.initVal(data);
    } else {
      if (_.isObject(data)) {
        this.initVal(data);
      }
      console.log("warming:please use function to return data");
    }
  }
  initVal(data) {
    this.$data = new observe(data);
  }
}
