import React from "react";
import classes from "./AlgorithmSwitch.module.css";

const algorithmSwitch = props => {
  return (
    <div className={classes.wrapper}>
      <button
        className={classes.algorithmSwitchButton}
        onClick={() => props.switch()}
      >
        {props.algorithm}
      </button>
    </div>
  );
};
export default algorithmSwitch;
