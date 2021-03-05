const axel = require('axel')
const Tetris = require('./TetrisCore')

process.stdout.write(new Buffer.from([0x1b, 0x5b, 0x3f, 0x31, 0x30, 0x34, 0x39, 0x68]))
axel.clear()

const stdin = process.openStdin()
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')
stdin.on( 'data', function( key ){
  if (key === '\u0003') {
    process.stdout.write(new Buffer.from([0x1b, 0x5b, 0x3f, 0x31, 0x30, 0x34, 0x39, 0x6c]))
    process.exit() // ctrl-c ( end of text )
  }
  handleKeyPress(key)
})

const tetris = new Tetris({ onUpdate, onFail })

function handleKeyPress (key) {
  switch (key) {
    case 'h': {
      return tetris.left()
    }
    case 'l': {
      return tetris.right()
    }
    case 'j': {
      return tetris.bottom()
    }
    case 'k': {
      return tetris.rotate()
    }
  }
}

function onFail () {
  console.log("fail")
}

function onUpdate (matrix, points, nextElement) {
  axel.fg(0,0,0)
  axel.text(50,1,points.toString())
  // return console.table(nextElement)
  matrix.forEach((row, rowIndex) => row.forEach((i, colIndex) => {
    if (i) axel.bg(...i.color)
    else colIndex % 2 ? axel.bg(255,255,255) : axel.bg(220, 220, 220)
    axel.box(colIndex*4 + 1, rowIndex*2, 4, 2)
    axel.cursor.restore()
  }))
  axel.scrub(50, 20, 16, 8)
  nextElement.forEach((row, rowIndex) => row.forEach((col, colIndex) => {
    if (col) {
      axel.bg(...col.color)
      axel.box(50 + colIndex * 4, 20 + rowIndex * 2, 4, 2)
    } else {
    }
  }))
}
