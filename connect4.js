/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  //////////////make Game into a class
  constructor(p1, p2, height = 6, width = 7) {
    //////////make instances
    this.players = [p1, p2]; ////////
    this.height = height; ///////////
    this.width = width; //////////
    this.currPlayer = p1; // active player: 1 or 2 /////////
    this.makeBoard(); /////////
    this.makeHtmlBoard(); /////////
    this.gameOver = false; /////////
  }
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    ////////////remove 'function' to make it a method
    this.board = []; ///////////// add this.
    for (let y = 0; y < this.height; y++) {
      //////////change height to this.height
      this.board.push(Array.from({ length: this.width })); ////change width to this.width and add this.
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    ////////////remove 'function' to make it a method
    const board = document.getElementById("board");
    board.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // store a reference to the handleClick bound function
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this); /////////////////

    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      ////////////// change width to this.width
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      /////////////change height to this.height
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        //////////////change width to this.width
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    //////////////remove 'function' to make a method
    for (let y = this.height - 1; y >= 0; y--) {
      ///////change height to this.height
      if (!this.board[y][x]) {
        ////add this.
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    //////remove 'function' to make method
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color; ///////////////??
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    /////remove 'function' to make method
    alert(msg);
    const top = document.querySelector("#column-top"); ////////////???
    top.removeEventListener("click", this.handleGameClick); //////////// ???
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    ////////remove 'function' to make method
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x); //////add this.
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer; /////add this.
    this.placeInTable(y, x); /////add this.

    // check for win
    if (this.checkForWin()) {
      /////add this.
      this.gameOver = true; ///add this.
      return this.endGame(
        `Congratulations to the ${this.currPlayer.color} player, YOU won!!!`
      ); ///add this. and updated message
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      ///add this.
      return this.endGame("Good try but it's a Tie!!!"); ////add this. and update msg
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0]; ////add this. ????
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    ////remove 'function' to make method
    const _win = (
      cells //////change function to const & make arrow function
    ) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      cells.every(
        /////removed return as we can assume it returns
        ([y, x]) =>
          y >= 0 &&
          y < this.height && /////change height to this.height
          x >= 0 &&
          x < this.width && ////////change width to this.width
          this.board[y][x] === this.currPlayer /////add this.
      );

    for (let y = 0; y < this.height; y++) {
      /////change height to this.height
      for (let x = 0; x < this.width; x++) {
        //////change width to this.width
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById("start-game").addEventListener("click", () => {
  let p1 = new Player(document.getElementById("p1-color").value);
  let p2 = new Player(document.getElementById("p2-color").value);
  new Game(p1, p2);
});

// makeBoard();
// makeHtmlBoard();
