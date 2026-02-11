import React from 'react';
import './App.css';
import Projects from './components/Projects';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DecryptCode Web3 Assessment</h1>
        <p>Complete the tasks in ASSESSMENT.md</p>
      </header>
      <Projects />
    </div>
  );
}

export default App;
