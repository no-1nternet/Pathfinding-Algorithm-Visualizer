import React, { useState } from 'react';
import './NavBar.css';
const NavBar = props => {
    const [algoName, setAlgoName] = useState('none');

    return (
        <React.Fragment>
            <div className="wrapper">
                <h1>Pathfinding Algorithm Visualizer</h1>
                <nav>
                    <ul className="nav__links">
                        <li><div
                            className={`${algoName === "astar" ? "active" : ""}`}
                            onClick={() => { setAlgoName("astar") }}>A star</div></li>
                        <li><div
                            className={`${algoName === "dijkstra" ? "active" : ""}`}
                            onClick={() => {
                                setAlgoName("dijkstra");
                                props.clear();
                            }}>Dijkstra</div></li>
                    </ul>
                </nav>
                <div>
                    <button onClick={() => { props.clear() }}
                        disabled={props.animating === true}
                        className="clearButton"
                    >Clear Path</button>
                    <button onClick={() => { props.clearWalls() }}
                        disabled={props.animating === true}
                        className="clearButton"
                    >Clear Walls</button>
                    <button
                        disabled={algoName === "none" || props.animating === true}
                        onClick={() => { props.exe(algoName) }}
                        className="startButton">
                        {algoName === "none" ? "Please select algorithon" :
                            props.animating ? "Animating" : `Go ${algoName}!`}
                    </button>
                </div>
            </div>

        </React.Fragment >

    );
}

export default NavBar;