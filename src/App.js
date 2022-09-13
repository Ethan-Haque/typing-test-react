import Leaderboard from "./components/Leaderboard";
import TypingTest from "./components/TypingTest";
import { Link } from 'react-scroll';
import { MdKeyboard, MdLeaderboard } from "react-icons/md";
import { useState } from "react";

function App() {
  const [otherComponent, setOtherComponent] = useState("leaderboard");

  return (
    <div>
      <Link to={otherComponent} smooth={true} duration={550}>
        <button onClick={() => otherComponent === "leaderboard" ? setOtherComponent("test") : setOtherComponent("leaderboard")}
          className="fixed z-90 bottom-10 right-8 bg-sky-500 w-[calc(20px_+_4vmin)] h-[calc(20px_+_4vmin)] rounded-full drop-shadow-lg flex justify-center items-center text-white text-[calc(4px_+_3vmin)] hover:bg-blue-700 hover:drop-shadow-2xl duration-500">
          {otherComponent === "leaderboard" ?
            <MdLeaderboard />
            :
            <MdKeyboard />
          }
        </button>
      </Link>
      <TypingTest />

      <Leaderboard />

    </div>
  );
}

export default App;
