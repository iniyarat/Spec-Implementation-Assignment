// ================= CELL =================
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isWall = false;

    this.element = document.createElement("div");
    this.element.className = "cell";
  }

  toggleWall() {
    this.isWall = !this.isWall;
    this.element.classList.toggle("wall");
  }

  setStart() {
    this.element.classList.add("start");
  }

  setGoal() {
    this.element.classList.add("goal");
  }
}


// ================= GRID =================
class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
  }

  createGrid() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];

      for (let c = 0; c < this.cols; c++) {
        let cell = new Cell(r, c);
        row.push(cell);
      }

      this.cells.push(row);
    }
  }

  render() {
    let gridDiv = document.getElementById("grid");
    gridDiv.innerHTML = "";

    for (let row of this.cells) {
      for (let cell of row) {
        gridDiv.appendChild(cell.element);
      }
    }
  }
}


// ================= PATHFINDER =================
class Pathfinder {
  bfs(grid, start, goal) {
    let queue = [start];
    let visited = new Set();
    let parent = new Map();

    visited.add(start);

    while (queue.length > 0) {
      let current = queue.shift();

      if (current === goal) {
        return this.buildPath(parent, start, goal);
      }

      let neighbors = this.getNeighbors(grid, current);

      for (let n of neighbors) {
        if (!visited.has(n) && !n.isWall) {
          visited.add(n);
          parent.set(n, current);
          queue.push(n);

          n.element.classList.add("visited");
        }
      }
    }

    return null;
  }

  getNeighbors(grid, cell) {
    let list = [];
    let r = cell.row;
    let c = cell.col;

    if (r > 0) list.push(grid.cells[r - 1][c]);
    if (r < grid.rows - 1) list.push(grid.cells[r + 1][c]);
    if (c > 0) list.push(grid.cells[r][c - 1]);
    if (c < grid.cols - 1) list.push(grid.cells[r][c + 1]);
    return list;
  }
  buildPath(parent, start, goal) {
    let path = [];
    let current = goal;
    while (current !== start) {
      path.push(current);
      current = parent.get(current);
    }
    return path;
  }
}

class UIManager {
  constructor(grid) {
    this.grid = grid;
    this.mode = "wall";
    this.start = null;
    this.goal = null;
    this.pathfinder = new Pathfinder();
  }
  setMode(mode) {
    this.mode = mode;
  }
  handleClick(cell) {
    if (this.mode === "start") {
      if (this.start) this.start.element.classList.remove("start");
      this.start = cell;
      cell.setStart();
    }
    else if (this.mode === "goal") {
      if (this.goal) this.goal.element.classList.remove("goal");
      this.goal = cell;
      cell.setGoal();
    }
    else if (this.mode === "wall") {
      cell.toggleWall();
    }
  }

  runAlgorithm() {
    if (!this.start || !this.goal) {
      alert("Set start and goal first");
      return;
    }
    let path = this.pathfinder.bfs(this.grid, this.start, this.goal);
    if (path) {
      for (let cell of path) {
        cell.element.classList.add("path");
      }
    } else {
      alert("No path found");
    }
  }
}

let grid = new Grid(10, 10);
grid.createGrid();
grid.render();
let ui = new UIManager(grid);

// connect clicks
for (let row of grid.cells) {
  for (let cell of row) {
    cell.element.onclick = () => {
      ui.handleClick(cell);
    };
  }
}