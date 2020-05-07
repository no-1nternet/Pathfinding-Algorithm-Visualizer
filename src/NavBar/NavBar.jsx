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
                            className={`${algoName === "A star" ? "active" : ""}`}
                            onClick={() => { setAlgoName("A star") }}>A star</div></li>
                        <li><div
                            className={`${algoName === "dijkstra" ? "active" : ""}`}
                            onClick={() => { setAlgoName("dijkstra") }}>Dijkstra</div></li>
                    </ul>
                </nav>
                <div>
                    <button onClick={() => { props.clear() }}>Clear</button>
                    <button
                        disabled={algoName === "none"}
                        onClick={() => { props.exe(algoName) }}>
                        {algoName === "none" ? "Please select algorithon" : `Go ${algoName}!`}
                    </button>
                </div>
            </div>

        </React.Fragment>

    );
}

export default NavBar;