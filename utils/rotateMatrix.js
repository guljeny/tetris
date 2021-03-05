module.exports = function (matrix) {
  const _matrix = Array.from([...Array(matrix[0].length)], () => [...Array(matrix.length)].fill())
  matrix.forEach((row, rowIndex) => row.forEach((col, colIndex) => {
    _matrix[colIndex][row.length - 1 - rowIndex] = col
  }))
  return _matrix
}
