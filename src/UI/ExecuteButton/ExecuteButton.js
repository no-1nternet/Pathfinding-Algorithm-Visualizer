import React from "react";
import classes from "./ExecuteButton.module.css";

const executeButton = props => (
  <button onClick={() => props.onClick()} className={classes.executeButton}>
    <span>{props.text}</span>
  </button>
);
export default executeButton;
