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
      if (value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      setTimeout(() => {
        if (self.state === PENDING) {
          self.state = RESOLVED
          self.value = value
          self.resolvedCallbacks.map(cb => cb(self.value))
        }
      }, 0)
    }
    const reject = value => {
      setTimeout(() => {
        if (self.state === PENDING) {
          self.state = REJECTED
          self.value = value
          self.rejectedCallbacks.map(cb => cb(self.value))
        }
      }, 0)
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
    const self = this
    if (this.state === PENDING) {
      return new MyPromise((resolve, reject) => {
        self.resolvedCallbacks.push(() => {
          try {
            resolve(onFulfilled(self.value))
          } catch (e) {
            reject(e)
          }
        })
        self.rejectedCallbacks.push(() => {
          try {
            reject(onRejected(self.value))
          } catch (e) {
            reject(e)
          }
        })
      })
    }
    if (this.state === RESOLVED) {
      return new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            resolve(onFulfilled(self.value))
          } catch (reason) {
            reject(reason)
          }
        })
      })
    }
    if (this.state === REJECTED) {
      return new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            reject(onRejected(self.value))
          } catch (reason) {
            reject(reason)
          }
        })
      })
    }
  }

}