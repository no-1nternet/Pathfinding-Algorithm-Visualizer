import React from "react";
import classes from "./TopBar.module.css";
const topBar = props => {
  return (
    <>
      <div className={classes.topBar}>
        <p className={classes.titleName}>Pathfinding Visualizor</p>
        <p className={classes.myName}>By Steven Yan</p>
      </div>
    </>
  );
};

export default topBar;
