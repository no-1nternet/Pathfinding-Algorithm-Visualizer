// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
let cameFrom = [];
let distanceMap = [];

export const dijkstra = (grid, startNode, finishNode) => {
  initializeCameFrom(grid);
  initializeDistanceMap(grid);
  const visitedNodesInOrder = [];
  distanceMap[startNode.row][startNode.col] = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If encounter a wall, skip it.
    if (closestNode.type === "node-wall") continue;
    // If the closest node is at a distance of infinity,
    // must be trapped and should therefore stop.
    if (distanceMap[closestNode.row][closestNode.col] === Infinity) {
      return visitedNodesInOrder;
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    //If reaches the finishNode, return
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, visitedNodesInOrder);
  }
};

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) =>
    distanceMap[nodeA.row][nodeA.col] - distanceMap[nodeB.row][nodeB.col]);
}

function updateUnvisitedNeighbors(node, grid, visitedNodesInOrder) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid, visitedNodesInOrder);
  for (const neighbor of unvisitedNeighbors) {
    distanceMap[neighbor.row][neighbor.col] = distanceMap[node.row][node.col] + 1
    cameFrom[neighbor.row][neighbor.col] = node;
  }
}

function getUnvisitedNeighbors(node, grid, visitedNodesInOrder) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !visitedNodesInOrder.includes(neighbor));
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function reconstructPathDijkstra(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== "") {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = cameFrom[currentNode.row][currentNode.col];
  }
  cameFrom = [];
  distanceMap = []
  return nodesInShortestPathOrder;
}

const initializeCameFrom = grid => {
  for (const row of grid) {
    const cameFromRow = [];
    for (let i = 0; i < row.length; i++) {
      cameFromRow.push("");
    }
    cameFrom.push(cameFromRow);
  }
  return;
};

const initializeDistanceMap = grid => {
  for (const row of grid) {
    const distanceMapRow = [];
    for (let i = 0; i < row.length; i++) {
      distanceMapRow.push(Infinity)
    }
    distanceMap.push(distanceMapRow);
  }
  return;
};
