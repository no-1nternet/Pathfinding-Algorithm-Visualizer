import React from "react";
import Node from "../Node/Node";
import classes from "./GridMap.module.css";
const gridMap = props => {
  return (
    <table className={classes.gridMap}
      onMouseDown={props.mapMouseDown}
      onMouseUp={props.mapMouseUp}>
      <tbody>
        {props.grid.map((row, rowIdx) => {
          return (
            <tr key={rowIdx} className={classes.nodeRow}>
              {row.map((node, nodeIdx) => {
                const { row, col, type, toggled } = node;
                return (
                  <Node
                    key={nodeIdx}
                    type={type}
                    col={col}
                    toggled={toggled}
                    row={row}
                    onMouseDown={(row, col) => props.nodeMouseDown(row, col)}
                    onMouseEnter={(row, col) => props.nodeMouseEnter(row, col)}
                    onMouseUp={(row, col) => props.nodeMouseUp(row, col)}
                    onMouseLeave={(row, col) => props.nodeMouseLeave(row, col)}
                  ></Node>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default gridMap;
