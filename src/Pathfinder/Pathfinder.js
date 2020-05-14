import React, { Component } from "react";
import "./Pathfinder.css";
import GridMap from "./GridMap/GridMap";
import "../algorithms/dijkstra";
import { dijkstra, reconstructPathDijkstra } from "../algorithms/dijkstra";
import { astar, reconstructPathAstar } from "../algorithms/astar";
import NavBar from "../NavBar/NavBar";

export default class Pathfinder extends Component {
  constructor(props) {
    super(props);
    const h = this.props.windowSize.height;
    const w = this.props.windowSize.width;
    const nRows = Math.floor((h - 140) / 25);
    const nCols = Math.floor((w - 200) / 25);
    this.state = {
      rows: nRows,
      cols: nCols,
      startNode: {
        row: Math.floor(nRows / 2),
        col: Math.floor(nCols / 4),
      },
      finishNode: {
        row: Math.floor(nRows / 2),
        col: Math.floor(nCols / 4) * 3,
      },
      grid: [],
      mouseIsPressed: false,
      animating: false
    };
  }

  componentDidMount() {

    const grid = getInitialGrid(this.state.rows, this.state.cols);
    this.setState({ grid });
  }

  resetGird = () => {
    for (let row = 0; row < this.state.rows; row++) {
      for (let col = 0; col < this.state.cols; col++) {
        if (row === this.state.startNode.row && col === this.state.startNode.col) {
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        } else if (row === this.state.finishNode.row && col === this.state.finishNode.col) {
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        } else {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const grid = getInitialGrid(this.state.rows, this.state.cols);
    this.setState({ grid });
  };

  resetGirdButWall = (ifClearWall) => {
    const grid = this.state.grid;
    for (let nodesRow of grid) {
      for (let node of nodesRow) {
        if (node.type === "node-visited" || node.type === "node-shortest-path") {
          node.type = "";
        }
        if (node.row === this.state.startNode.row && node.col === this.state.startNode.col) {
          node.type = "node-start";
        } else if (node.row === this.state.finishNode.row && node.col === this.state.finishNode.col) {
          node.type = "node-finish";
        } else if (node.type === "node-wall" && ifClearWall) {
          node.type = "";
        }
      }
    }
    this.setState({ grid });
  };

  //Mouse Event Handlers
  //Map
  handleMapMouseDown = () => {
    this.setState({
      mouseIsPressed: true
    });
  }

  handleMapMouseUp = () => {
    this.setState({
      mouseIsPressed: false
    });
  }

  //Node
  handleNodeMouseDown = (row, col) => {
    setWall(this.state.grid, row, col);
  };
  handleNodeMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    setWall(this.state.grid, row, col);
    this.forceUpdate();
  };
  handleNodeMouseLeave = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    UntoggledNode(this.state.grid, row, col);
    this.forceUpdate();
  };
  handleNodeMouseUp = (row, col) => {
    UntoggledNode(this.state.grid, row, col);
  };


  //Animation
  animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        node.type = "node-visited";
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        node.type = "node-shortest-path";
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 10 * i);
    }
    setTimeout(() => {
      this.setState({ animating: false });
    }, 10 * nodesInShortestPathOrder.length);
  }

  visualize = (algo) => {
    this.resetGirdButWall();
    this.setState({ animating: true });
    const startNode = this.state.grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode = this.state.grid[this.state.finishNode.row][this.state.finishNode.col];
    let visitedNodesInOrder;
    let nodesInShortestPathOrder;
    if (algo === "dijkstra") {
      visitedNodesInOrder = dijkstra(this.state.grid, startNode, finishNode);
      nodesInShortestPathOrder = reconstructPathDijkstra(finishNode);
    }
    if (algo === "astar") {
      visitedNodesInOrder = astar(this.state.grid, startNode, finishNode);
      nodesInShortestPathOrder = reconstructPathAstar(finishNode);
    }


    this.animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <main>
        <NavBar
          exe={this.visualize}
          clear={this.resetGirdButWall}
          clearWalls={this.resetGird}
          animating={this.state.animating}
        />

        <GridMap
          grid={grid}
          mouseIsPressed={mouseIsPressed}
          mapMouseDown={this.handleMapMouseDown}
          mapMouseUp={this.handleMapMouseUp}
          nodeMouseDown={this.handleNodeMouseDown}
          nodeMouseEnter={this.handleNodeMouseEnter}
          nodeMouseUp={this.handleNodeMouseUp}
          nodeMouseLeave={this.handleNodeMouseLeave}
        />
        <p>*Click on the map to add walls.*</p>
      </main>
    );
  }
}

//Helpers
const getInitialGrid = (nRow, nCol) => {
  const grid = [];
  for (let row = 0; row < nRow; row++) {
    const currentRow = [];
    for (let col = 0; col < nCol; col++) {
      currentRow.push(createNode(col, row, nRow, nCol));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, nRow, nCol) => {
  const nodeType = (row === Math.floor(nRow / 2) && col === Math.floor(nCol / 4)) ? "node-start" :
    (row === Math.floor(nRow / 2) && col === Math.floor(nCol / 4) * 3) ? "node-finish" : "";
  return {
    col,
    row,
    type: nodeType,
    toggled: false,
    isWall: false,
    previousNode: null
  };
};

// const getNewGridWithWallToggled = (grid, row, col) => {
//   const newGrid = grid.slice();
//   const node = newGrid[row][col];
//   if (node.toggled) return newGrid;
//   const newNode = {
//     ...node,
//     type: node.type === "node-wall" ? "" :
//       !(node.type === "node-start" || node.type === "node-finish") ? "node-wall" :
//         node.type,
//     toggled: true
//   };
//   newGrid[row][col] = newNode;
//   return newGrid;
// };

const setWall = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.toggled) return;
  const nodeType = node.type + "";
  if (nodeType === "node-wall") {
    node.type = "";
  } else if (!(node.type === "node-start" || node.type === "node-finish")) {
    node.type = "node-wall";
    node.key++;
    node.toggled = true;
  };
}

const UntoggledNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  node.toggled = false;
};