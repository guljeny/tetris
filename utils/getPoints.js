module.exports = function (deletedRows) {
  switch (deletedRows) {
    case 4:
      return 1500
    case 3:
      return 700
    case 2:
      return 300
    case 1:
      return 100
    default:
      return 0
  }
}
