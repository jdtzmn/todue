var $, storage, uuid

$(() => {
  // new task submit event
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

  // navbar-collapse padding event
  let prevNavbarHeight = 0
  let adjustTopPadding = () => {
    if (prevNavbarHeight - $('.navbar-fixed-top').height() !== 0) {
      $('body').css('padding-top', $('.navbar-fixed-top').height() + 40)
      prevNavbarHeight = $('.navbar-fixed-top').height()
      setTimeout(() => { adjustTopPadding() }, 20)
    } else {
      $('body').css('padding-top', $('.navbar-fixed-top').height() + 40)
      prevNavbarHeight = 0
    }
  }

  $('button.navbar-toggler').click(() => {
    setTimeout(() => { adjustTopPadding() }, 80)
  })

  $(window).resize(() => {
    adjustTopPadding()
  })

  adjustTopPadding()

  // task row collapsing event
  $('.task-row-collapse').click((e) => {
    let angle = JSON.parse($(e.currentTarget).parents().eq(2).find('.task-collapse').collapse('toggle').attr('aria-expanded')) ? 0 : 180
    $({deg: angle}).animate({deg: angle + 180}, {
      duration: 400,
      step: (val) => {
        $(e.currentTarget).find('i').css({
          transform: 'rotate(' + val + 'deg)'
        })
      }
    })
  })
})
