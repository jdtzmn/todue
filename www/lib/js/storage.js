let Storage = function () {
  if (!(this.constructor === Storage)) {
    return new Storage()
  }

  this.get = (e) => {
    let data = window.localStorage
    if (e) data = window.localStorage[e] ? window.localStorage[e] : undefined
    let isJSON = true
    try { JSON.parse(data) } catch (e) { isJSON = false }
    return isJSON ? JSON.parse(data) : data
  }

  this.local = this.get()

  this.set = (a, b) => {
    if (!a || !b) return new Error('key and value must not be blank')
    let data = this.local
    if (typeof b === 'object') b = JSON.stringify(b)
    if (data) {
      window.localStorage[a] = b
      this.local[a] = b
    } else {

    }
    return this.get()
  }

  this.remove = (a) => {
    if (!a) return new Error('key must not be blank')
    let data = this.local
    if (data) {
      delete window.localStorage[a]
      delete this.local[a]
    } else {

    }
    return this.get()
  }

  this.tasks = {
    get: (id) => {
      if (id) {
        return (this.get('tasks') || []).filter((e) => {
          return e !== null && e.id === id
        })[0]
      } else {
        return (this.get('tasks') || []).filter((e) => {
          return e !== null
        })
      }
    },
    add: (task) => {
      let tasks = this.tasks.get()
      tasks.push(task)
      return this.tasks.set(tasks)
    },
    remove: (id) => {
      if (typeof id === 'object') id = id.id
      let tasks = this.tasks.get().filter((e) => {
        return e !== null && e.id !== id
      })
      return this.tasks.set(tasks)
    },
    set: (tasks) => {
      storage.set('tasks', tasks)
      return this.tasks.get()
    }
  }
}

let storage = new Storage()
storage
