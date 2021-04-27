import logo from './logo.svg';
import "./App.css";

export function Home() {
    return (
        <main className="App-header">
            <img src="manifest-icon-512.png" className="App-logo" alt="logo"/>
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </a>
        </main>
    );
}