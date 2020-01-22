import React, { Component } from "react";

import "./Pathfinder.css";
import GridMap from "./GridMap/GridMap";
import "../algorithms/dijkstra";
import { dijkstra, reconstructPathDijkstra } from "../algorithms/dijkstra";
import { astar, reconstructPathAstar } from "../algorithms/astar";
import ExecuteButton from "../UI/ExecuteButton/ExecuteButton";
import TopBar from "../TopBar/TopBar";
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class Pathfinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  resetGird = () => {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        if (row === START_NODE_ROW && col === START_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        } else {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const grid = getInitialGrid();
    this.setState({ grid });
  };

  //Mouse Event Handlers
  handleMouseDown = (row, col, grid) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    // console.log(`down === ${this.state.mouseIsPressed}`);
    this.setState({
      grid: newGrid,
      mouseIsPressed: true
    });
    // console.log(`down after === ${this.state.mouseIsPressed}`);
  };

  handleMouseEnter = (row, col, pressed, grid) => {
    if (!pressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    this.setState({ grid: newGrid });
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
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
      }, 50 * i);
    }
  }

  visualize = () => {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = reconstructPathAstar(finishNode);
    this.animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <main>
        <TopBar />
        <ExecuteButton onClick={this.visualize} text="Visualize Algorithm" />
        <button onClick={this.resetGird}>reset</button>
        <GridMap
          grid={grid}
          mouseIsPressed={mouseIsPressed}
          onMouseDown={this.handleMouseDown}
          onMouseEnter={this.handleMouseEnter}
          onMouseUp={this.handleMouseUp}
        />
      </main>
    );
  }
}

//Helpers
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
