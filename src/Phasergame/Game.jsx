import { useRef, useState, useEffect } from "react";
import GamePhaser from "./GamePhaser";
import '../App.css';

export default function Game() {
  
  const [gameRef, setGameRef] = useState(null);
  

  return (
    <GamePhaser setGameRef={setGameRef} />
  )
}