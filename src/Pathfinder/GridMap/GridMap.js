import React from "react";
import Node from "../Node/Node";
import classes from "./GridMap.module.css";
const gridMap = props => {
  return (
    <div className={classes.gridMap}>
      {props.grid.map((row, rowIdx) => {
        return (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart, isWall } = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  row={row}
                  isWall={isWall}
                  mouseIsPressed={props.mouseIsPressed}
                  onMouseDown={(row, col) =>
                    props.onMouseDown(row, col, props.grid)
                  }
                  onMouseEnter={(row, col) =>
                    props.onMouseEnter(
                      row,
                      col,
                      props.mouseIsPressed,
                      props.grid
                    )
                  }
                  onMouseUp={() => props.onMouseUp()}
                ></Node>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default gridMap;
