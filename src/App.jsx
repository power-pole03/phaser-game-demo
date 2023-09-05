import React from 'react';
import './App.css';
import backgroundImage from './images/bg.png';

function App() {
  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className="appBackground">
      {/* your JSX content here */}
    </div>
  );
}

export default App;
