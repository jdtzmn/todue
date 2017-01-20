// https://gist.github.com/jdtzmn/9c4fe1a13d44de0397f7

var Average = function () {
  let arr = []
  this.add = function (num) {
    if (Array.isArray(num)) {
      for (var i in num) {
        arr.push(num[i])
      }
      return this.average()
    } else {
      arr.push(num)
      return this.average()
    }
  }

  this.shift = function () {
    arr.shift()
    return this.average()
  }

  this.list = arr

  this.remove = function (a, b) {
    if (a === 0 && b) {
      arr.splice(arr.length + b, 1)
    } else {
      arr.splice(a, 1)
    }
    return arr
  }

  this.average = function (num) {
    var total = 0
    for (let i = (num && arr.length - num >= 0 ? arr.length - num : 0); i < arr.length; i++) {
      total += arr[i] || 0
    }
    return total / (num && num <= arr.length ? num : arr.length)
  }
}
Average
