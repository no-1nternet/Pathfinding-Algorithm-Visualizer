import React from "react";
import classes from "./Toolbar.module.css";
import NavigationItems from "../NavigationItems";

const toolbar = props => (
  <header className={classes.Toolbar}>
    <nav>
      <NavigationItems />
    </nav>
  </header>
);

export default toolbar;
