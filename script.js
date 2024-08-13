const N = 9
var gridContainer = document.getElementById("gridContainer")
let note = document.querySelector(".note")
const clear = document.querySelector(".clear")
const solve = document.querySelector(".solve")
let grid = []
let isSolved = false

// Generating content for each cell dynamically
for (var row = 1; row <= N; row++) {
  for (var col = 1; col <= N; col++) {
    var cell = document.createElement("div")
    cell.className = "item"

    var input = document.createElement("input")
    input.className = "inputvalue"
    input.type = "text"

    cell.appendChild(input)
    gridContainer.appendChild(cell)
  }
}

clear.addEventListener("click", () => {
  var gridVal = document.querySelectorAll(".item")
  var note = document.querySelector(".note")
  gridVal.forEach((child) => {
    child.children[0].value = ""
    child.children[0].style.backgroundColor = "transparent"
    child.children[0].style.color = "#3b82f6"
  })
  note.innerText = ""
  isSolved = false
})

solve.addEventListener("click", () => {
  if (isSolved) {
    return
  }
  let checkInput = getAllInputValues()

  if (checkInput === false) {
    return
  }

  let matrix = grid
  if (checkSuduko(matrix) === false) {
    return
  }

  let res = sudokuSolver(matrix)
  isSolved = true
  if (res === false) {
    note.innerText = "no solution exist for the suduko provided."
    return
  }

  var gridVal = document.querySelectorAll(".item")
  var i = 0,
    j = -1
  gridVal.forEach((child) => {
    let val = child.querySelector(".inputvalue")

    if ((j + 1) % N === 0) {
      if (j !== -1) {
        i++
        grid.push(rows)
      }
      rows = []
      j = -1
    }

    j++

    val.value = matrix[i][j]
  })
})

function getAllInputValues() {
  grid = []

  var gridVal = document.querySelectorAll(".item")
  var i = -1,
    j = -1,
    rows = []
  let checkInput = true
  gridVal.forEach((child) => {
    let val = child.querySelector(".inputvalue")
    val = val.value.trim()

    if ((j + 1) % 9 === 0) {
      if (j !== -1) {
        grid.push(rows)
      }
      rows = []
      j = -1
    }
    j++
    if (val === "" || isNaN(val)) {
      if (val === "") {
        rows.push(parseInt(0))
      } else {
        note.innerText = `Provided input is not the number: ${val}`
        checkInput = false
        return false
      }
    } else {
      child.children[0].style.backgroundColor = "#fb7185"
      child.children[0].style.color = "#f8fafc"
      rows.push(parseInt(val))
    }
  })
  grid.push(rows)
  return checkInput
}

function checkSuduko(arr) {
  let len = arr.length
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let val = arr[i][j]
      if (val === 0) {
        continue
      }

      if (val > 9 || val < 0) {
        note.innerText = `${val} is not in the range [0-9].`
        return false
      }

      for (let c = 0; c < N; c++) {
        if (c === j) {
          continue
        }

        if (arr[i][c] == val) {
          note.innerText = `${val} is same in the row.`
          return false
        }
      }

      for (let r = 0; r < N; r++) {
        if (r === i) {
          continue
        }

        if (arr[r][j] == val) {
          note.innerText = `${val} is same in the column.`
          return false
        }
      }
    }
  }
  return true
}

function isPossible(matrix, row, col, num) {
  // Checking possibility in row
  for (let j = 0; j < N; j++) {
    if (matrix[row][j] === num) {
      return false
    }
  }

  // Checking possibility in column
  for (let i = 0; i < N; i++) {
    if (matrix[i][col] === num) {
      return false
    }
  }

  // Row index of 3*3 matrix
  const iRow = row - (row % 3)
  const jCol = col - (col % 3)

  // Checking possibility in 3*3 matrix
  for (let i = iRow; i < iRow + 3; i++) {
    for (let j = jCol; j < jCol + 3; j++) {
      if (matrix[i][j] === num) {
        return false
      }
    }
  }

  // num can be placed at row and col
  return true
}

function findEmptyPosition(matrix, position) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (matrix[i][j] === 0) {
        position.row = i
        position.col = j
        return true
      }
    }
  }
  return false
}

function sudokuSolver(matrix) {
  const position = { row: 0, col: 0 }

  // Finding the empty place index
  const getEmptyPosition = findEmptyPosition(matrix, position)
  if (!getEmptyPosition) {
    return true
  }

  // Filling the empty space
  if (getEmptyPosition) {
    const { row, col } = position
    for (let num = 1; num <= N; num++) {
      const possible = isPossible(matrix, row, col, num)
      if (possible) {
        matrix[row][col] = num
        const getAns = sudokuSolver(matrix)
        if (getAns) {
          return true
        } else {
          matrix[row][col] = 0
        }
      }
    }
  }

  return false
}
