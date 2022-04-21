/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 9;
const HEIGHT = 8;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for(let i = 0; i < HEIGHT; i++){
    // for(let j = 0; j < WIDTH; j++) {
    //   board[i].push(undefined);
    // }
    // I'm honestly unclear why my code above doesn't work, and I used the snippet below from the solution provided, instead
    board.push(Array.from({ length: WIDTH }));
  }
  console.log(board);
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  
  const htmlBoard = document.getElementById('board');

  // adding top row and listener for the click 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // adding rows to the table, and assigning the proper IDs so that the chips can be added in the appropriate cells
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
    //console.log(`y: ${y}, x: ${x}`);
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {

  const chip = document.createElement('div');
  chipColor = currPlayer === 1 ? 'red' : 'blue';

  chip.classList.add('piece');
  chip.classList.add(chipColor);

  const cell = document.getElementById(`${y}-${x}`);
  cell.append(chip);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return setTimeout(endGame(`Player ${currPlayer} won!`),10);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('No winner and no plays left. It\'s a Tie!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  switchHeader(currPlayer);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // looping through each row in the table
  for (let y = 0; y < HEIGHT; y++) {
    // looping through each column in the talbe
    for (let x = 0; x < WIDTH; x++) {
      // checking for matches horizontally
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // checking for matches vertically
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // checking for for matches diagonally, down-right
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // checking for for matches diagonally, down-left
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function switchHeader(currPlayer) {
  classForPlayer = currPlayer === 1 ? 'red-font' : 'blue-font';
  console.log(classForPlayer);
  setHeader(classForPlayer, currPlayer);
}

function setHeader(color, player) {
  const header = document.getElementById('player');
  header.className='';
  header.classList.add(color);
  header.classList.add('bold-font');
  header.innerText = `Player ${player}`;
}

makeBoard();
makeHtmlBoard();
setHeader('red-font', currPlayer);
