import React from "react";
import classes from "./NavigationItems.module.css";
import Navigationitem from "./NavigationItem/NavigationItem";
const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    <Navigationitem visualize={props.visualize} active>
      Visualize
    </Navigationitem>
    <Navigationitem>Check out</Navigationitem>
  </ul>
);

export default navigationItems;
