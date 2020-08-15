class Vue {
  constructor(option) {
    this.$data = option.data
    observe(this.$data)
    new Watcher()
    // 模拟render过程
    console.log('~render', this.$data.a)
  }
}

function defineReactive(obj, key, value) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.addSub(Dep.target)
      return value
    },
    set: function (newVal) {
      if (newVal === value) { return }
      dep.notify()
    }
  })
}

function observe(data) {
  Object.entries(data).forEach(([key, value]) => {
    defineReactive(data, key, value)
  })
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

class Watcher {
  constructor() {
    Dep.target = this
  }

  update() {
    console.log('视图更新啦！');
  }
}

Dep.target = null