var loggedIn, $

let Storage = function () {
  if (!(this.constructor === Storage)) {
    return new Storage()
  }

  this.get = (e, cb) => {
    let data = {}
    if (loggedIn) {
      $.get('/tasks/get', (res) => {
        data = res
        if (e && typeof e !== 'function') data = data[e] ? data[e] : undefined
        let isJSON = true
        if (typeof data !== 'object') {
          try { JSON.parse(data) } catch (e) { isJSON = false }
        } else {
          isJSON = false
        }
        if (typeof e === 'function') cb = e
        if (cb) cb(isJSON ? JSON.parse(data) : data)
      })
    } else {
      data = JSON.parse(JSON.stringify(window.localStorage))
      if (e && typeof e !== 'function') data = data[e] ? data[e] : undefined
      let isJSON = true
      try { JSON.parse(data) } catch (e) { isJSON = false }
      data = isJSON ? JSON.parse(data) : data
      for (var i in data) {
        let isJSON = true
        try { JSON.parse(data[i]) } catch (e) { isJSON = false }
        data[i] = isJSON ? JSON.parse(data[i]) : data[i]
      }
      if (typeof e === 'function') cb = e
      if (cb) cb(data)
    }
  }

  this.local = {}
  this.get((data) => {
    this.local = data
  })

  this.set = (a, b, push) => {
    if (!a || !b) return new Error('key and value must not be blank')
    if (loggedIn) {
      this.local[a] = b
      this.push()
    } else {
      window.localStorage[a] = JSON.stringify(b)
      this.local[a] = b
    }
    return this.local
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

  this.push = (cb) => {
    $.get('/tasks/set', { tasks: this.local }).done(() => { if (cb) cb() })
  }

  this.tasks = {
    get: (id) => {
      if (id) {
        return (this.local.tasks || []).filter((e) => {
          return e && e.id === id
        })[0]
      } else {
        return (this.local.tasks || []).filter((e) => {
          return e
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
    setTaskProperty: (id, a, b) => {
      if (typeof id === 'object') id = id.id
      let tasks = this.tasks.get()
      for (let i in tasks) {
        if (tasks[i].id === id) {
          tasks[i][a] = b
        }
      }
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
