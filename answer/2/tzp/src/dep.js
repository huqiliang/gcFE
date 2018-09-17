export default class Dep {
  constructor() {
    /* 用来存放Watcher对象的数组 */
    this.subs = [];
  }

  /* 在subs中添加一个Watcher对象 */
  addSub(sub) {
    this.subs.push(sub);
    console.log("收集~");
  }

  /*依赖收集，当存在Dep.target的时候添加观察者对象*/
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  /* 通知所有Watcher对象更新视图 */
  notify() {
    this.subs.forEach(sub => {
      sub.update();
      console.log("更新~");
    });
  }
}
/*依赖收集完需要将Dep.target设为null，防止后面重复添加依赖。*/
Dep.target = null;
