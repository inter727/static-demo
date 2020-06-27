const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

class MyPromise {

  constructor(fn) {
    this.state = PENDING
    this.value = null
    this.resolvedCallbacks = []
    this.rejectedCallbacks = []
    const self = this
    const resolve = value => {
      if (self.state === PENDING) {
        self.state = RESOLVED
        self.value = value
        self.resolvedCallbacks.map(cb => cb(self.value))
      }
    }
    const reject = value => {
      if (self.state === PENDING) {
        self.state = REJECTED
        self.value = value
        self.rejectedCallbacks.map(cb => cb(self.value))
      }
    }
    try {
      fn(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }
    if (this.state === PENDING) {
      this.resolvedCallbacks.push(onFulfilled)
      this.rejectedCallbacks.push(onRejected)
    }
    if (this.state === RESOLVED) {
      onFulfilled(this.value)
    }
    if (this.state === REJECTED) {
      onRejected(this.value)
    }
  }

}