import React, { useState, useEffect, useRef, useCallback} from "react";
import { Container , Table } from 'react-bootstrap';
import './App.css';
import {Link} from "wouter";

function Home() {

  const handleResetClick = () => {
    // Save the username in local storage
    localStorage.clear();
  };

  //music player
  const [currentTrackIndex,setCurrentTrackIndex] = useState(0);
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

  const storedData = localStorage.getItem('Leaderboard');
  const leaderboardData = storedData ? JSON.parse(storedData) : [];
  const top5LeaderboardData = leaderboardData.sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    
    <Container fluid className="appBackground">
      <video className="logo" autoPlay muted>
        <source
          src="logo_animation.mp4"
          type="video/mp4"
        />
      </video>
      {/* <audio src={playlist[currentTrackIndex]} ref={audioRef} autoPlay controls></audio> */}
      <h1 className="gameTitle">Match Game</h1>
      <div className='Summary'>
        <h3 className='title'>Summary</h3>

        <h4>Objective:</h4>
        <p>Match Game challenges players to find and pair identical items from a grid or set. The goal is to remember where each item is located and match them up in the fewest moves possible or within a given timeframe.</p>

        <h4>How to Play:</h4>
        <ol>
            <li>Begin by starting a new game.</li>
            <li>A grid will appear with all items facedown.</li>
            <li>Click on any two items to reveal their face.</li>
            <li>If they match, they will remain revealed; if not, they will flip back over.</li>
            <li>Continue this process, trying to remember each item's location to make correct matches.</li>
            <li>The game ends when all pairs have been successfully matched.</li>
        </ol>
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
            {top5LeaderboardData.map((score, index) => (
              <tr key={index}>
              <td>
                {score.date}
              </td>
              <td>{score.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Link href="/Game" >
        <button size="lg" className="playBtn" >Start game</button>
      </Link>
      {/* <button size="md" onClick={handleResetClick} className="Reset-button" >Reset Leaderboard</button> */}
    </Container>
    
  );
}

export default Home;
