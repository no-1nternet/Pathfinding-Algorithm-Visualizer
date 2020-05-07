import React, { Component } from "react";
import windowSize from 'react-window-size';
import "./Pathfinder.css";
import GridMap from "./GridMap/GridMap";
import "../algorithms/dijkstra";
import { dijkstra, reconstructPathDijkstra } from "../algorithms/dijkstra";
import { astar, reconstructPathAstar } from "../algorithms/astar";
import NavBar from "../NavBar/NavBar";
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class Pathfinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      count: 0
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  resetGird = () => {
    console.log(this.props.windowWidth);
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
      }, 50 * i);
    }
  }

  visualize = (algo) => {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    let visitedNodesInOrder;
    let nodesInShortestPathOrder;
    if (algo === "astar") {
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
  const nodeType = (row === START_NODE_ROW && col === START_NODE_COL) ? "node-start" :
    (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) ? "node-finish" : "";
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

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.toggled) return newGrid;
  const newNode = {
    ...node,
    type: node.type === "node-wall" ? "" :
      !(node.type === "node-start" || node.type === "node-finish") ? "node-wall" :
        node.type,
    toggled: true
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

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