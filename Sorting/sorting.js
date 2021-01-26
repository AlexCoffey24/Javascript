document.getElementById("solve").addEventListener("click", sort);

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const canvas_container = document.getElementById("canvas-container");

canvas.height = 1000;
canvas.width = 1210;

var icicles = [];
var icicle_heights;
var icicle_width = 40;
var icicle_gap = 10;
var num_of_icicles = Math.floor(canvas.width / (icicle_gap + icicle_width));
var algo = "bubble";
var is_sorted = false;

const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, "#3700b3");
backgroundGradient.addColorStop(1, "#03dac6");

class Icicle {
  constructor(index, height) {
    this.height = height;
    this.x = index * (icicle_width + icicle_gap) + icicle_gap;
  }

  draw() {
    c.beginPath();
    c.moveTo(this.x, 0);
    c.lineTo(this.x + icicle_width / 2, this.height);
    c.lineTo(this.x + icicle_width, 0);
    c.fillStyle = "rgb(173, 240, 240)";
    c.fill();
    c.closePath();
  }
}

function generate_icicles() {
  is_sorted = false;
  icicles = [];
  icicle_heights = [];
  let icicle_unit_height = Math.floor((canvas.height - 100) / num_of_icicles);
  for (let i = 0; i < num_of_icicles; i++) {
    icicle_heights.push(icicle_unit_height * (i + 1));
  }
  for (let i = 0; i < num_of_icicles; i++) {
    let temp_index = randomIntFromRange(0, icicle_heights.length - 1);
    icicles.push(new Icicle(i, icicle_heights[temp_index]));
  }
}

function update_screen() {
  // Redraw Background
  c.beginPath();
  c.fillStyle = backgroundGradient;
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.closePath();
  // Draw Icicles
  for (let i = 0; i < num_of_icicles; i++) {
    icicles[i].draw();
  }
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sort() {
  if (algo == "bubble") {
    bubble_sort();
  }
}

function bubble_sort() {
  let counter = 0;
  while (!is_sorted) {
    is_sorted = true;
    for (i = 0; i < icicles.length - 1 - counter; i++) {
      if (icicles[i].height > icicles[i + 1].height) {
        let temp = icicles[i].height;
        icicles[i].height = icicles[i + 1].height;
        icicles[i + 1].height = temp;
        is_sorted = false;
      }
    }
    counter += 1;
  }
  update_screen();
}

generate_icicles();
update_screen();
