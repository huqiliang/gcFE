import Dep from "./dep";
export default class Watcher {
  constructor() {
    /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
    Dep.target = this;
  }

  /* 更新视图的方法 */
  update() {
    //console.log("视图更新啦～");
  }
  /*添加一个依赖关系到Deps集合中*/
  addDep(dep) {
    dep.addSub(this);
  }
}

Dep.target = null;
