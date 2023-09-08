import React, { useState, useEffect, useRef, useCallback} from "react";
import { Container , Button , Table } from 'react-bootstrap';
import './App.css';
import { /*updateHighScores,*/ getHighScores } from "./score";
import {Link} from "wouter";

function Home() {

  //music player
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const totalTracks = 32;
  const playlist = Array.from({ length: totalTracks }, (_, i) => `/musics/track${i + 1}.wav`);
  const handleTrackEnd = useCallback((  ) => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, [playlist.length]);



  useEffect(() => {
    const currentAudio = audioRef.current; // Store the current ref value in a variable

  if (currentAudio) {
    currentAudio.addEventListener('ended', handleTrackEnd);

      // Cleanup: Remove event listener when the component is unmounted or before re-running the effect
      return () => {
        currentAudio.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [handleTrackEnd]);

  //score
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    // Load high scores on component mount
    setHighScores(getHighScores());
  }, []);

  return (
    
    <Container fluid className="appBackground">
      <audio src={playlist[currentTrackIndex]} ref={audioRef} autoPlay controls></audio>
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
      <Link href="/Game" >
        <Button size="lg" className="playBtn" >Start game</Button>
      </Link>
    </Container>
    
  );
}

export default Home;
