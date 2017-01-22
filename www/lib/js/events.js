var $, storage, uuid

$(() => {
  // navbar-collapse padding event
  let prevNavbarHeight = 0
  let adjustTopPadding = () => {
    if (prevNavbarHeight - $('.fixed-top').height() !== 0) {
      $('body').css('padding-top', $('.fixed-top').height() + 40)
      prevNavbarHeight = $('.fixed-top').height()
      setTimeout(() => { adjustTopPadding() }, 20)
    } else {
      $('body').css('padding-top', $('.fixed-top').height() + 40)
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

  // navbar buttons events
  $('.add-task').click(() => {
    let id = uuid.v1()
    storage.tasks.add({id: id, name: '', checked: false, tags: [], difficulty: undefined, date: ''})
    storage.tasks.render()
    $('.task[data-id=' + id + ']').find('input.task-name').focus()
    $('.navbar-collapse').collapse('hide')
    adjustTopPadding()
  })

  $('.remove-task').click(() => {
    $('.task-delete-box.visible').length ? $('.task-delete-box.visible').removeClass('visible') : $('.task-delete-box').addClass('visible')
    $('.navbar-collapse').collapse('hide')
    adjustTopPadding()
  })
})
