document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timer
  let score = 0
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'white'
  ]

  // Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  // Randomly selects Tetromino and first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  // Draws Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  draw()

  // Undraw the Tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // Adds function to keycodes
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      // Moves Tetromino to the right
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // Move down
  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    stop()
  }

  // Stops Tetrominoes
  function stop () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('filled'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('filled'))
      // Drops new Tetromino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Moves Tetromino to the left unless it reaches the leftmost edge
  function moveLeft() {
    undraw()
    const reachedLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!reachedLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('filled'))) {
      currentPosition += 1
    }

    draw()
  }

  // Moves Tetromino to the right unless it reaches the rightmost edge
  function moveRight() {
    undraw()
    const reachedRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!reachedRightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('filled'))) {
      currentPosition -= 1
    }

    draw()
  }

  // Rotates Tetromino
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) { // if current rotation is equal to fourth position, returns back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // Displays Tetromino that is Next Up in Side Grid
  const displaySideGrid = document.querySelectorAll('.side-grid div')
  const displayWidth = 4
  const displayIndex = 0


  // Tetromino displayed without rotation
  const upNext = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // L-Tetromino without rotation
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // Z-Tetromino without rotation
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // T-Tetromino without rotation
    [0, 1, displayWidth, displayWidth + 1], // O-Tetromino without rotation
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // I-Tetromino without rotation
  ]

  // Displays shape in side-grid display
  function displayShape () {
    // clears Tetromino from grid
    displaySideGrid.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNext[nextRandom].forEach(index => {
      displaySideGrid[displayIndex + index].classList.add('tetromino')
      displaySideGrid[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // Allows Start/Pause Button to have functionality
  startBtn.addEventListener('click', () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    } else {
      draw()
      timer = setInterval(moveDown, 750)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // score
  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('filled'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('filled')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // GAME OVER
  function gameOver () {
    if(current.some(index => squares[currentPosition + index].classList.contains('filled'))) {
      scoreDisplay.innerHTML = 'GAME OVER (RELOAD PAGE)'
      scoreDisplay.style.color = 'red'
      clearInterval(timer)
    }
  }


})
