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
                            onClick={() => { setAlgoName("dijkstra") }}>Dijkstra</div></li>
                    </ul>
                </nav>
                <div>
                    <button onClick={() => { props.clear() }}>Clear</button>
                    <button onClick={() => { props.exe(algoName) }}>Execute</button>
                </div>
            </div>

        </React.Fragment>

    );
}

export default NavBar;