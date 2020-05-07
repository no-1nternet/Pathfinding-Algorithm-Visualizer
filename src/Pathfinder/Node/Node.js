import React from "react";

import "./Node.css";

const Node = props => {
  const {
    col,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onMouseLeave,
    row,
    type
  } = props;

  return (
    <td
      id={`node-${row}-${col}`}
      className={`node ${type}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
      onMouseLeave={() => onMouseLeave(row, col)}
    ></td>
  );

}

export default Node;