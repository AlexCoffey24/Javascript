const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

var grid;
var grid_color = "rgb(0, 0, 0)";
var cell_size = 20;
var cell_gap = 2;
var num_of_rows = Math.floor(canvas.height / (cell_size + cell_gap));
var num_of_cols = Math.floor(canvas.width / (cell_size + cell_gap) - 1);
var mouse_x;
var mouse_y;
var cell_changer = "barrier";
var drawing = false;
var start_set = false;
var end_set = false;
var starting_cell;

canvas.addEventListener("mousedown", (m) => {
  drawing = true;
});

canvas.addEventListener("mousemove", (m) => {
  if (drawing === true) {
    mouse_x = m.offsetX;
    mouse_y = m.offsetY;
    change_cell(mouse_x, mouse_y);
  }
});

canvas.addEventListener("mouseup", (m) => {
  drawing = false;
});

canvas.addEventListener("click", (m) => {
  mouse_x = m.offsetX;
  mouse_y = m.offsetY;
  change_cell(mouse_x, mouse_y);
});

document.getElementById("reset_cell").addEventListener("click", () => {
  cell_changer = "reset";
});

document.getElementById("barrier").addEventListener("click", () => {
  cell_changer = "barrier";
});

document.getElementById("start").addEventListener("click", () => {
  cell_changer = "start";
});

document.getElementById("end").addEventListener("click", () => {
  cell_changer = "end";
});

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.x = col * (cell_size + cell_gap);
    this.y = row * (cell_size + cell_gap);
    this.color = "white";
    this.neighbors = [];
    this.width = cell_size;
    this.height = cell_size;
  }

  get_pos() {
    return this.row, this.col;
  }

  is_closed() {
    return this.color == "red";
  }

  is_open() {
    return this.color == "green";
  }

  is_barrier() {
    return this.color == "black";
  }

  is_start() {
    return this.color == "orange";
  }

  is_end() {
    return this.color == "blue";
  }

  reset() {
    this.color = "white";
  }

  make_start() {
    this.color = "orange";
  }

  make_closed() {
    this.color = "red";
  }

  make_open() {
    this.color = "green";
  }

  make_barrier() {
    this.color = "black";
  }

  make_end() {
    this.color = "blue";
  }

  make_path() {
    this.color = "purple";
  }

  update_neighbors(grid) {
    this.neighbors = [];
    // Check Up
    if (this.row > 0 && !grid[this.row - 1][this.col].is_barrier()) {
      this.neighbors.push(grid[this.row - 1][this.col]);
    }
    // Check down
    if (
      this.row < this.num_of_rows - 1 &&
      !grid[this.row + 1][this.col].is_barrier()
    ) {
      this.neighbors.push(grid[this.row + 1][this.col]);
    }
    // Check Left
    if (this.col > 0 && !grid[this.row][this.col - 1].is_barrier()) {
      this.neighbors.push(grid[this.row][this.col - 1]);
    }
    // Check Right
    if (
      this.col < this.num_of_cols - 1 &&
      !grid[this.row][this.col + 1].is_barrier()
    ) {
      this.neighbors.push(grid[this.row][this.col + 1]);
    }
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
    c.closePath;
  }
}

function make_grid() {
  grid = [];
  for (i = 0; i < num_of_rows; i++) {
    grid.push([]);
    for (j = 0; j < num_of_cols; j++) {
      let cell = new Cell(i, j);
      grid[i].push(cell);
    }
  }
}

function draw_grid() {
  for (i = 0; i < num_of_rows; i++) {
    for (j = 0; j < num_of_cols; j++) {
      let cell = grid[i][j];
      cell.draw();
    }
  }
}

function change_cell(x, y) {
  row = Math.floor(y / (cell_size + cell_gap));
  col = Math.floor(x / (cell_size + cell_gap));
  if (cell_changer == "reset") {
    if (grid[row][col].is_start()) {
      start_set = false;
    } else if (grid[row][col].is_end()) {
      end_set = false;
    }
    grid[row][col].reset();
  } else if (cell_changer == "barrier") {
    grid[row][col].make_barrier();
  } else if (cell_changer == "start") {
    if (!start_set) {
      grid[row][col].make_start();
      starting_cell = grid[row][col];
      start_set = true;
    }
  } else if (cell_changer == "end") {
    if (!end_set) {
      grid[row][col].make_end();
      end_set = true;
    }
  }
  draw_grid();
}

function clear_grid() {
  make_grid();
  draw_grid();
  start_set = false;
  end_set = false;
  starting_cell = null;
}

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);
make_grid();
draw_grid();

// A* algorithm

var open_set = [];
var closed_set = [];

function h(p1, p2) {
  // No tuples in JS
  // x1, y1 = p1
  // x2, y2 = p2
}

function reconstruct_path() {}
function aStar() {}
