let pull = function (a, i) {
  if (a.indexOf(i) > -1) a.splice(a.indexOf(i), 1)
  return a
}
pull
