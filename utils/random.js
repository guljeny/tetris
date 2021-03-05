module.exports = function (max, min = 0) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1))
}
