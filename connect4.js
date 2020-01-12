/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let startGame = document.getElementById("button");
startGame.addEventListener("click", beginGame);

function beginGame() {
  let gameHolder = document.getElementById("board");

  let player1Color = document.getElementById("player1").value;
  let player2Color = document.getElementById("player2").value;

  let player1 = new Player(player1Color);
  let player2 = new Player(player2Color);


  gameHolder.innerHTML = "";
  let newGame = new Game(player1, player2);

  newGame.makeBoard();
  newGame.makeHtmlBoard();

}

class Player {
  constructor(playerColor) {
    this.playerColor = playerColor;
  }
}

class Game {
  constructor(player1, player2, height = 6, width = 7) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.currPlayer = player1.playerColor;// active player: 1 or 2
    this.board = [];// array of rows, each row is array of cells  (board[y][x])
    this.gameState = true;
    this.player1=player1;
    this.player2=player2;
  }




  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const HTMLBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    HTMLBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      HTMLBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */


  placeInTable(y, x) {
    const piece = document.createElement('div');
    let columnTop = document.getElementById("column-top");
    columnTop.appendChild(piece);
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer;
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
    let pixelsFromLeft = x * 56 +4;
    let pixelsFromTop = (y + 1) * 56 + 4;
    piece.style.left = `${pixelsFromLeft}px`;
    piece.style.setProperty('--fall-distance', `${pixelsFromTop}px`);
    piece.style.setProperty('--fall-duration', `${(y +1) * .2}s`)
    piece.classList.add("falling");
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {

    if (this.gameState === false) {
      return;
    }
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)

    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    setTimeout(function(){
    if (this.checkForWin()) {
      this.gameState = false;
      console.log(board);
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameState = false;
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.player1.playerColor ? this.player2.playerColor : this.player1.playerColor;
    this.gameState = true;
  }.bind(this), Math.max(100,(y + 1) * 200));
  }
  _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer
    );
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */


  checkForWin() {
    
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }
}








