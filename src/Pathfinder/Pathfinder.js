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
      count: 0
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
    // const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    // this.setState({
    //   grid: newGrid,
    // });
    setWall(this.state.grid, row, col);
  };
  handleNodeMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    // console.log("on!Enter");
    // const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    // this.setState({ grid: newGrid });
    setWall(this.state.grid, row, col);
    var c = this.state.count + 1;
    this.setState({ count: c })
  };
  handleNodeMouseLeave = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    // console.log("on!Leave");
    // const newGrid = UntoggledNode(this.state.grid, row, col);
    // this.setState({ grid: newGrid });
    UntoggledNode(this.state.grid, row, col);
    var c = this.state.count + 1;
    this.setState({ count: c })
  };
  handleNodeMouseUp = (row, col) => {
    // const newGrid = UntoggledNode(this.state.grid, row, col);
    // this.setState({ grid: newGrid });
    // console.log("off!");
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
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 20 * i);
    }
  }

  visualize = (algo) => {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode = grid[this.state.finishNode.row][this.state.finishNode.col];
    let visitedNodesInOrder;
    let nodesInShortestPathOrder;
    if (algo === "A star") {
      visitedNodesInOrder = astar(grid, startNode, finishNode);
      nodesInShortestPathOrder = reconstructPathAstar(finishNode);
    } else if (algo === "dijkstra") {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      nodesInShortestPathOrder = reconstructPathDijkstra(finishNode);
    }

    this.animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <main>
        <NavBar
          exe={this.visualize}
          clear={this.resetGird}
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
    distance: Infinity,
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