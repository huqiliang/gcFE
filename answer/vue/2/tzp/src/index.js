import Observer from "./observer.js";
import Watcher from "./watcher.js";
export default class View {
  constructor(options) {
    this._data = options.data;
    // 观察数据
    new Observer(this._data);
    // 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象
    new Watcher();
    console.log("render~");
  }
}
