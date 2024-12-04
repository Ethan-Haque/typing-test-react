import Leaderboard from "./components/Leaderboard";
import TypingTest from "./components/TypingTest";

import { useState } from "react";
function App() {
  const [refreshTrigger, setRefreshTrigger] = useState({ sentencecount: null }); //to update score after score submission

  const handleScoreUpdate = (sentencecount) => {
    setRefreshTrigger({ sentencecount }); // Pass the updated sentencecount
};

  return (
    <div>
      <TypingTest onScoreUpdate={handleScoreUpdate} />
      <Leaderboard refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
