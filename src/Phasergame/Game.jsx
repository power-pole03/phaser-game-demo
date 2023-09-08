import { useState } from "react";
import GamePhaser from "./GamePhaser";
import '../App.css';

export default function Game() {
  
  const [setGameRef] = useState(null);
  

  return (
    <GamePhaser setGameRef={setGameRef} />
  )
}