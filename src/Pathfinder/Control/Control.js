import React from "react";
import classes from "./Control.module.css";
const control = props => {
  return <div className={classes.Control}>{props.children}</div>;
};
export default control;
