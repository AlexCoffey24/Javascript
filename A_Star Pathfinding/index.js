const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

var grid;
var grid_color = "rgb(0, 0, 0)";
var cell_size = 25;
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
var ending_cell;
var solving = false;
var algo = "A*";

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

document.getElementById("solve").addEventListener("click", algorithm);

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
    this.f = Infinity;
    this.g = Infinity;
    this.h = Infinity;
    this.previous = undefined;
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

  update_neighbors() {
    this.neighbors = [];
    // Check Up
    if (this.row > 0 && !grid[this.row - 1][this.col].is_barrier()) {
      this.neighbors.push(grid[this.row - 1][this.col]);
    }
    // Check Down
    if (
      this.row < num_of_rows - 1 &&
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
      this.col < num_of_cols - 1 &&
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

  update_h() {
    this.h =
      Math.abs(this.col - ending_cell.col) +
      Math.abs(this.row - ending_cell.row);
  }

  update_f() {
    this.f = this.g + this.h;
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
  if (!solving) {
    row = Math.floor(y / (cell_size + cell_gap));
    col = Math.floor(x / (cell_size + cell_gap));
    if (cell_changer == "reset") {
      if (grid[row][col].is_start()) {
        start_set = false;
        starting_cell = null;
      } else if (grid[row][col].is_end()) {
        end_set = false;
        ending_cell = null;
      }
      grid[row][col].reset();
    } else if (cell_changer == "barrier") {
      if (grid[row][col].is_start()) {
        start_set = false;
        starting_cell = null;
      } else if (grid[row][col].is_end()) {
        end_set = false;
        ending_cell = null;
      }
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
        ending_cell = grid[row][col];
        end_set = true;
      }
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
  solving = false;
}

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);
make_grid();
draw_grid();

// A* algorithm

var open_set;
function algorithm() {
  // Update all cell neighbors
  for (i = 0; i < num_of_rows; i++) {
    for (j = 0; j < num_of_cols; j++) {
      let cell = grid[i][j];
      cell.update_neighbors();
    }
  }

  if ((algo = "A*")) {
    open_set = [];
    open_set.push(starting_cell);
    starting_cell.g = 0;
    starting_cell.update_h();
    starting_cell.update_f();

    a_star();
  }
}

function a_star() {
  if (open_set.length > 0) {
    let open_set_index = 0;
    for (let i = 0; i < open_set.length; i++) {
      if (open_set[i].f < open_set[open_set_index].f) {
        open_set_index = i;
      }
    }
    let current = open_set[open_set_index];

    if (current === ending_cell) {
      return reconstruct_path();
    }

    remove_from_array(open_set, current);

    for (let i = 0; i < current.neighbors.length; i++) {
      let neighbor = current.neighbors[i];
      let temp_g = current.g + 1;

      if (temp_g < neighbor.g) {
        neighbor.previous = current;
        neighbor.g = temp_g;
        neighbor.update_h();
        neighbor.update_f();
        if (!open_set.includes(neighbor)) {
          open_set.push(neighbor);
          neighbor.make_open();
          neighbor.draw();
        }
      }
    }

    if (current != starting_cell) {
      current.make_closed();
      current.draw();
    }

    setTimeout(() => {
      a_star();
    }, 50);
  } else {
    console.log("no path available");
  }
}

function remove_from_array(array, element) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
}

function reconstruct_path() {
  let temp = ending_cell;
  while (temp.previous) {
    temp.make_path();
    temp.draw();
    temp = temp.previous;
  }
  ending_cell.make_end();
  ending_cell.draw();
}
