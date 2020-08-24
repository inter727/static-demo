class Vue {
  constructor(option) {
    this.$data = option.data
    this.$data = observe(this.$data)
    new Watcher()
    // 模拟render过程
    console.log('~render', this.$data.a)
  }
}

function defineReactive(obj) {
  const dep = new Dep()
  return new Proxy(obj, {
    get(obj, p, receiver) {
      dep.addSub(Dep.target)
      return Reflect.get(obj, p, receiver)
    },
    set(target, p, value, receiver) {
      if (value === obj[p]) { return }
      dep.notify()
      Reflect.set(target, p, value, receiver)
    }
  })
}

function observe(data) {
  return defineReactive(data)
}

class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
Dep.target = null

class Watcher {
  constructor() {
    Dep.target = this
  }

  update() {
    console.log('视图更新啦！');
  }
}