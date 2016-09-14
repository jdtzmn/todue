let Storage = function () {
  if (!(this.constructor === Storage)) {
    return new Storage()
  }

  this.storage = window.localStorage

  this.get = (e) => {
    let data = window.localStorage
    if (e) data = window.localStorage[e] ? window.localStorage[e] : undefined
    return data
  }

  this.set = (a, b) => {
    if (!a || !b) return new Error('key and value must not be blank')
    let data = this.storage
    if (data) {
      window.localStorage[a] = b
      this.storage[a] = b
    } else {

    }
    return this.get()
  }

  this.remove = (a) => {
    if (!a) return new Error('key must not be blank')
    let data = this.storage
    if (data) {
      delete window.localStorage[a]
      delete this.storage[a]
    } else {

    }
    return this.storage
  }
}

let storage = new Storage()
storage
