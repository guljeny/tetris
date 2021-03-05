const random = require('./utils/random')
const rotateMatrix = require('./utils/rotateMatrix')
const getPoints = require('./utils/getPoints')
const { ELEMENT_LIB, COLORS } = require('./constants')


const defaultParams = {
  width: 10,
  height: 20,
  onUpdate: () => {},
  initialSpeed: 700,
  speedUp: 20,
  colors: COLORS,
  elementLib: ELEMENT_LIB,
}

module.exports = class Tetris {
  constructor (params) {
    this.params = { ...defaultParams, ...params }
    this.state = this._createEmptyState()
    this.element = this._createNewElement()
    this._createNewElement()
    this.failed = false
    this.points = 0
    this._tick()
  }

  _createEmptyState () {
    return Array.from([...Array(this.params.height)], () => [...Array(this.params.width)].fill(null))
  }

  _createNewElement () {
    const { nextElement } = this
    const color = this.params.colors[random(this.params.colors.length - 1)]
    const matrix = this.params.elementLib[random(this.params.elementLib.length - 1)]
    const opts = {
      type: 'box',
      color,
    }
    this.nextElement = {
      top: 0,
      left: Math.floor((this.params.width - matrix[0].length) / 2),
      matrix: matrix.map(row => row.map(el => el && opts)),
    }
    return nextElement || this.nextElement
  }

  _isPossibleMove (nextElementState) {
    const _element = { ...(this.element || {}), ...nextElementState }
    return _element.matrix.reduce((acc, row, rowIndex) => row.reduce((_acc, col, colIndex) => {
      if (acc === false || _acc === false) return false
      if (!col) return _acc
      if (
        this.state[rowIndex + _element.top] === undefined ||
        this.state[rowIndex + _element.top][colIndex + _element.left] === undefined ||
        this.state[rowIndex + _element.top][colIndex + _element.left]
      ) return false
      return _acc
    }, true), true)
  }

  _tick = () => {
    if (this._isPossibleMove({ top: this.element.top + 1 })) {
      this.element.top += 1
    }
    this._updateState()
    !this.failed && setTimeout(this._tick, this.params.initialSpeed)
  }

  _updateState () {
    if (!this._isPossibleMove({ top: this.element.top + 1 })) {
      this.element.matrix.forEach((row, rowIndex) => row.forEach((col, colIndex) => {
        if (col) this.state[this.element.top + rowIndex][this.element.left + colIndex] = col
      }))
      this.element = this._createNewElement()
      if (!this._isPossibleMove(this.element)) {
        this.failed = true
        return this.params.onFail()
      }
    }
    const { newState, deletedRows } = this.state.reverse().reduce((acc, row) => {
      if (row.every(el => el !== null)) {
        return { ...acc, deletedRows: acc.deletedRows + 1 }
      } else {
        acc.newState[acc.row] = row
        return { ...acc, row: acc.row - 1 }
      }
    }, { row: this.params.height - 1, deletedRows: 0, newState: this._createEmptyState() })
    this.state = newState
    this.points += getPoints(deletedRows)
    this.params.initialSpeed -= this.params.speedUp * deletedRows
    this.params.onUpdate(
      this.state.map((row, rowIndex) => row.map((i, cellIndex) => {
        const el = this.element.matrix[rowIndex - this.element.top]
          && this.element.matrix[rowIndex - this.element.top][cellIndex - this.element.left]
        return el || i
      })),
      this.points,
      this.nextElement.matrix,
    )
    return true
  }

  left = () => {
    if (this.failed) return
    if (this._isPossibleMove({ left: this.element.left - 1 })) this.element.left -= 1
    this._updateState()
  }

  right = () => {
    if (this.failed) return
    if (this._isPossibleMove({ left: this.element.left + 1 })) this.element.left += 1
    this._updateState()
  }

  rotate = () => {
    if (this.failed) return
    const matrix = rotateMatrix(this.element.matrix)
    if (this._isPossibleMove({ matrix })) this.element.matrix = matrix
    this._updateState()
  }

  bottom = () => {
    if (this.failed) return
    if (this._isPossibleMove({ top: this.element.top + 1 })) this.element.top += 1
    this._updateState()
  }
}
