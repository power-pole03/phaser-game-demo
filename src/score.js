export function updateHighScores(newScore) {
    const scoresKey = "highScores";
    let highScores = JSON.parse(localStorage.getItem(scoresKey) || "[]");
  
    // Add new score and sort the array
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score); // Sort in descending order
  
    // Keep only the top 5 scores
    highScores = highScores.slice(0, 5);
  
    // Save back to local storage
    localStorage.setItem(scoresKey, JSON.stringify(highScores));
  }
  
  export function getHighScores() {
    return JSON.parse(localStorage.getItem("highScores") || "[]");
  }
  