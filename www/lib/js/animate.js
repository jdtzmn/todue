var $

$.fn.extend({
  animateCSS: function (animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    this.addClass('animated ' + animationName).one(animationEnd, () => {
      $(this).removeClass('animated ' + animationName)
    })
  }
})
