/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const MAX_TURNS = WIDTH * HEIGHT;
let turns = 0;
let clicksDisabled = false;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  
  for (let i = 0; i < WIDTH; i++){
    board.push([]);
  }
  
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" letiable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  // TODO: add comment for this code. This appends a cell to our column and adds event listeners to respond to clicks.
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code. This appends rows to each of our columns.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  return HEIGHT - board[x].length - 1; 
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let id = `${y}-${x}`;

  // create div just for piece and append to columnTop
  let piece = document.createElement("div");
  let columnTop = document.getElementById("column-top");
  columnTop.appendChild(piece);

  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);

  let pixelsFromLeft = x * 56 +2;
  let pixelsFromTop = (y + 1) * 56 + 2;
  piece.style.left = `${pixelsFromLeft}px`;

  piece.style.setProperty('--fall-distance', `${pixelsFromTop}px`);
  piece.style.setProperty('--fall-duration', `${(y +1) * .2}s`)
  piece.classList.add("falling");
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if(clicksDisabled) return;

  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  //let y = findSpotForCol(x);
  //if (y === null) {
  //  return;
  //}
  let y = findSpotForCol(x);
  if (y === -1) return; 
  board[x].push(currPlayer);
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  clicksDisabled = true;
  turns++;
  setTimeout(function() {
    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    if (turns === MAX_TURNS){
      endGame("Tie!");
    }
    
    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer = ((currPlayer === 1) ? 2 : 1);

    clicksDisabled = false;
  }, 100);

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

  // TODO: read and understand this code. Add comments to help you.
  // This function creates arrays for every single possible 4-space combination of pieces in every direction. If any one of these 4 is true, we return true. 
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
