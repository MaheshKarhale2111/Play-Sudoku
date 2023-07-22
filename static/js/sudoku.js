const newGrid = (size) => {
  let arr = new Array(size);

  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size);
  }

  for (let i = 0; i < CONSTANT.GRID_SIZE; i++) {
    for(let j = 0 ; j < CONSTANT.GRID_SIZE; j++) {
        arr[i][j] = CONSTANT.UNASSIGNED;
    }
  }

  return arr;
};

// check duplicate number in column

const isColSafe = (grid, col, value) => {
  for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
    if (grid[row][col] == value) {
      return false;
    }
  }
  return true;
};

// check duplicate in row
const isRowSafe = (grid, row, value) => {
  for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
    if (grid[row][col] === value) return false;
  }
  return true;
};

// check duplicate in 3 X 3 box
const isBoxSafe = (grid, box_row, box_col, value) => {
  for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
    for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
      if (grid[row + box_row][col + box_col] === value) return false;
    }
  }
  return true;
};

// combine above three
const isSafe = (grid, row, col, value) => {
  return (
    isColSafe(grid, col, value) &&
    isRowSafe(grid, row, value) &&
    isBoxSafe(grid, row - (row % 3), col - (col % 3), value) &&
    value !== CONSTANT.UNASSIGNED
  );
};

const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
}

// find unassigned cell
const findUnassigned
 = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
}

// array shuffling algorithm 
const shuffleArray = (arr) => {
    let curr_index = arr.length;

    while (curr_index !== 0) {
        // Generate a random index from 0 to (curr_index - 1)
        let rand_index = Math.floor(Math.random() * curr_index);
        
        // Decrease the current index by 1
        curr_index -= 1;

        // Swap the element at current index (arr[curr_index]) with the element at random index (arr[rand_index])
        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    }

    return arr;
}

// check if grid is complete or not 
// check puzzle is complete
const isFullGrid = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
}

const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    // to find empty cell , if not empty cell return true
    if (!findUnassignedPos(grid, unassigned_pos)) return true;
// constat. numbers we are calling from other file ig 
    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    // checking with isSafe function 
    number_list.forEach((num, i) => {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;

            if (isFullGrid(grid)) {
                return true;
            } else {
                if (sudokuCreate(grid)) {
            //if the grid is not full, it makes a recursive call to sudokuCreate(grid) to continue trying the next unassigned cell.
                    return true;
                }
            }

            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    });

    return isFullGrid(grid);
}




const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = [...grid]; // Create a copy of the original grid to modify
    let attemps = level; // Number of cells to remove based on the specified difficulty level

    while (attemps > 0) {
        let row = rand(); // Generate a random row index
        let col = rand(); // Generate a random column index

        // Keep generating random row and column until a non-empty cell is found
        while (res[row][col] === 0) {
            row = rand();
            col = rand();
        }

        // Set the value of the randomly selected cell to CONSTANT.UNASSIGNED (remove the number)
        res[row][col] = CONSTANT.UNASSIGNED;
        attemps--; // Decrement the attempts counter
    }

    return res; // Return the modified grid with cells removed
}

// generate sudoku base on level
const sudokuGen = (level) => {
    // Create a new empty Sudoku grid
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    // returns array 

    // Generate a complete Sudoku grid using the sudokuCreate function (based on backtracking)
    let check = sudokuCreate(sudoku);


    // Deep copy of the sudoku array using map and spread operator
    let sudokuCopy = sudoku.map(row => [...row]);

    // If a complete grid is successfully generated, proceed to remove cells to create the puzzle
    if (check) {
        // Remove cells from the complete grid to create the puzzle with the specified difficulty level
        let question = removeCells(sudokuCopy, level);

        // Return an object containing both the original complete grid and the generated puzzle (question)
        return {
            original: sudoku,
            question: question
        };
    }

    // If no complete grid can be generated, return undefined
    return undefined;
}


