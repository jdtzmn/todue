var $, storage, uuid

$(() => {
  $('.new-task-form').submit((e) => {
    e.preventDefault()

    let name = $('.new-task-name').val()
    let category = $('.category').val()
    let difficulty = $('.difficulty').val()
    let date = new Date($('.date').val()).toJSON()

    if (name && category && difficulty && date) {
      let tasks = storage.tasks ? JSON.parse(storage.tasks) : []

      let task = {
        name: name,
        category: category,
        difficulty: difficulty,
        due: date,
        done: false,
        id: uuid.v1()
      }

      tasks.push(task)

      storage.setItem('tasks', JSON.stringify(tasks))

      $('.new-task-name').val('')
      $('.category').val('')
      $('.difficulty').val('')
      $('.date').val('')
    } else {
      if (!name) {
        $('.new-task-name').focus().animateCSS('shake')
      } else if (!category) {
        $('.category').focus().animateCSS('shake')
      } else if (!difficulty) {
        $('.difficulty').focus().animateCSS('shake')
      } else if (!date) {
        $('.date').focus().animateCSS('shake')
      }
    }
  })
})
