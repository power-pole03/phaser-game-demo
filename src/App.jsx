import React, { useState, useEffect } from "react";
import { Container , Button , Table } from 'react-bootstrap';
import './App.css';
import { updateHighScores, getHighScores } from "./score";

function App() {

  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    // Load high scores on component mount
    setHighScores(getHighScores());
  }, []);

  // Just for demonstration, add a random high score
  const addRandomScore = () => {
    const newScore = {
      datetime: new Date().toISOString(),
      score: Math.floor(Math.random() * 100),
    };

    updateHighScores(newScore);
    setHighScores(getHighScores());
  };


  return (
    <Container fluid className="appBackground">
      <h1 className='gameTitle'>Match Game</h1>
      <div className='Summary'>
        <h3 className='title'>Summary</h3>
      </div>
      <div className='ScoreBoard'>
        <h3 className="scores">LeaderBoard</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date-Time</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {highScores.map((score, index) => (
              <tr key={index}>
              <td>
                {new Date(score.datetime).toLocaleString("en-CA", {
                  timeZone: "America/Toronto",
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                })}
              </td>
              <td>{score.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Button onClick={addRandomScore} size="lg" className="playBtn">Start game</Button>
    </Container>
    
  );
}

export default App;
