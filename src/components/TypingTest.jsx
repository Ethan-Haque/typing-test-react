import React, { useState, useEffect } from "react";
import useKeyPress from "../hooks/useKeyPress";

function TypingTest() {
  const [showMenu, setShowMenu] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const [testStart, setTestStart] = useState(false);

  // words
  const [words, setWords] = useState("begin");
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(1);

  // time
  const [milliseconds, setMilliseconds] = useState(30000);
  const [time, setTime] = React.useState(milliseconds);
  const [timerOn, setTimerOn] = React.useState(false);

  // stats
  const [keystrokes, setKeystrokes] = useState(0);
  const [accuracy, setAccuracy] = useState((100).toFixed(2));
  const [wpm, setWpm] = useState((0).toFixed(2));

  // padding to center text
  const [leftPadding, setLeftPadding] = useState("    ");
  const [rightPadding, setRightPadding] = useState("");

  // 3 stages for characters
  const [typedChars, setTypedChars] = useState("");
  const [currentChar, setCurrentChar] = useState(words.charAt(0));
  const [incomingChars, setIncomingChars] = useState(words.substring(1));

  // grab words for typing test
  useEffect(() => {
    fetch("/api/paragraphs/1/6")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        setWords(data);
      });

    const storedMilliseconds = localStorage.getItem('milliseconds');
    const storedSentenceCount = localStorage.getItem('sentenceCount');
    if (storedMilliseconds) {
      setMilliseconds(JSON.parse(storedMilliseconds));
    }
    if (storedSentenceCount) {
      setSentenceCount(JSON.parse(storedSentenceCount));
    }
  }, []);

  // timer logic
  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 10);
      }, 10);
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  // timeout
  if (timerOn && time <= 0) {
    clearVariables();
    setEndMessage("Ran out of time. Press CTRL + R to try again.");
  }

  useKeyPress((key) => {
    // temp vars
    let updatedTypedChars = typedChars;
    let updatedIncomingChars = incomingChars;

    // check for correct keystroke
    if (key === currentChar) {
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1)); // remove left padding
      }
      if (incomingChars.length < 21) {
        setRightPadding(rightPadding + " "); //add right padding
      }

      // update stages
      updatedTypedChars += currentChar; // add current char to typed chars
      setTypedChars(updatedTypedChars);
      setCurrentChar(incomingChars.charAt(0)); // set current char to next char
      updatedIncomingChars = incomingChars.substring(1); // remove new current char from incoming
      setIncomingChars(updatedIncomingChars);

      // calculate wpm
      if (testStart && incomingChars.charAt(0) === " ") {
        setWordCount(wordCount + 1);
        const durationInMinutes = (milliseconds - time) / 60000.0;
        setWpm((wordCount / durationInMinutes).toFixed(2));
      }

      //  check for last character
      if (incomingChars.length === 0) {
        // if test already started
        if (testStart) {
          //count last word
          setWordCount(wordCount + 1);
          const durationInMinutes = (milliseconds - time) / 60000.0;
          setWpm((wordCount / durationInMinutes).toFixed(2));

          // end
          clearVariables();
          setEndMessage("Nice Job. Press CTRL + R to try again.");
        } else {
          //start test
          localStorage.setItem('milliseconds', milliseconds);
          localStorage.setItem('sentenceCount', sentenceCount);
          setTestStart(true);
          setTimerOn(true);
          setShowMenu(null);
          // set words to option size
          let sentences = words.match(/[^.!?]+[.!?]+/g);
          let paragraph = "";
          for (var i = 0; i < sentenceCount; i++) {
            paragraph = paragraph + sentences[i];
          }
          setWords(paragraph);

          // reset all variables
          setLeftPadding(new Array(20).fill(" ").join(""));
          setRightPadding("");
          setTypedChars("");
          setCurrentChar(paragraph.charAt(0));
          setIncomingChars(paragraph.substring(1));
        }
      }
    } else if (!testStart) {
      // Keyboard Menu
      if (key === "m") {
        setShowMenu(!showMenu);
      } else {
        if (showMenu) {
          switch (key) {
            case "a":
              setTime(15000);
              setMilliseconds(15000);
              break;
            case "s":
              setTime(30000);
              setMilliseconds(30000);
              break;
            case "d":
              setTime(60000);
              setMilliseconds(60000);
              break;
            case "j":
              setSentenceCount(1);
              break;
            case "k":
              setSentenceCount(2);
              break;
            case "l":
              setSentenceCount(3);
              break;
            default:
              break;
          }
        }
      }
    }

    // log accuracy
    if (testStart) {
      const updatedKeystrokes = keystrokes + 1;
      setKeystrokes(updatedKeystrokes);
      setAccuracy(
        ((updatedTypedChars.length * 100) / updatedKeystrokes).toFixed(2)
      );
    }
  });

  function clearVariables() {
    setTimerOn(false);
    setTestStart(false);
    setLeftPadding("");
    setRightPadding("");
    setTypedChars("");
    setCurrentChar("");
    setIncomingChars("");
  }

  return (
    <div className="flex flex-col justify-around items-center h-screen  text-white text-[2vmin] bg-[#0d47a1] gap-4">
      {/* Menu */}
      <div className="section text-white text-[calc(5px_+_2vmin)]">
        {showMenu ? (
          <div>
            {/* Timer Radio */}
            <div className="section">
              <div className="text-[calc(1vmin_+_16px)]">Timer</div>
            </div>
            <div className="radio">
              <input
                type="radio"
                name="time"
                value="15"
                id="time1"
                className="radio_input"
                checked={milliseconds === 15000}
                onChange={(e) => {
                  setTime(e.target.value * 1000);
                  setMilliseconds(e.target.value * 1000);
                }}
              />
              <label htmlFor="time1" className="radio_label">
                15s
              </label>
              <input
                type="radio"
                name="time"
                value="30"
                id="time2"
                className="radio_input"
                checked={milliseconds === 30000}
                onChange={(e) => {
                  setTime(e.target.value * 1000);
                  setMilliseconds(e.target.value * 1000);
                }}
              />
              <label htmlFor="time2" className="radio_label">
                30s
              </label>
              <input
                type="radio"
                name="time"
                value="60"
                id="time3"
                className="radio_input"
                checked={milliseconds === 60000}
                onChange={(e) => {
                  setTime(e.target.value * 1000);
                  setMilliseconds(e.target.value * 1000);
                }}
              />
              <label htmlFor="time3" className="radio_label">
                60s
              </label>
            </div>
            {/* Timer Keys */}
            <div className="section">
              <div className="radio_keys">a</div>
              <div className="w-1/4 radio_keys">s</div>
              <div className="radio_keys">d</div>
            </div>
          </div>
        ) : null}
        {/* Menu Button */}
        <div className="w-1/6 text">
          <button
            className={
              showMenu == null ? "text-[#0d47a1] h-[7rem] " : " h-[7rem]"
            }
            disabled={showMenu == null ? true : false}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div>Menu</div>
            <div>m</div>
          </button>
        </div>
        {showMenu ? (
          <div>
            {/* SentenceCount Radio */}
            <div className="section">
              <div className="text-[calc(1vmin_+_16px)]">Sentences</div>
            </div>
            <div className="radio">
              <input
                type="radio"
                name="sentenceCount"
                value="1"
                id="sentences1"
                className="radio_input"
                checked={sentenceCount == 1}
                onChange={(e) => {
                  setSentenceCount(e.target.value);
                }}
              />
              <label htmlFor="sentences1" className="radio_label">
                &nbsp;1&nbsp;
              </label>
              <input
                type="radio"
                name="sentenceCount"
                value="2"
                id="sentences2"
                className="radio_input"
                checked={sentenceCount == 2}
                onChange={(e) => {
                  setSentenceCount(e.target.value);
                }}
              />
              <label htmlFor="sentences2" className="radio_label">
                &nbsp;2&nbsp;
              </label>
              <input
                type="radio"
                name="sentenceCount"
                value="3"
                id="sentences3"
                className="radio_input"
                checked={sentenceCount == 3}
                onChange={(e) => {
                  setSentenceCount(e.target.value);
                }}
              />
              <label htmlFor="sentences3" className="radio_label">
                &nbsp;3&nbsp;
              </label>
            </div>
            {/* Sentence Count Keys */}
            <div className="section">
              <div className="radio_keys">j</div>
              <div className="w-1/4 radio_keys">k</div>
              <div className="radio_keys">l</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Typing Test */}
      <div className="section text-[calc(20px_+_2vmin)] absolute">
        <div>{endMessage}</div>
        <p className="whitespace-pre">
          {/* Everything to the left of current char */}
          <span className="text-[#ccd6f6]">
            {(leftPadding + typedChars).slice(-20)}
          </span>
          {/* current char */}
          <span className="bg-sky-500">{currentChar}</span>
          {/* Everything to the right of current char */}
          <span>{incomingChars.substring(0, 20) + rightPadding}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="section text-[calc(2px_+_2vmin)]">
        <div className="w-1/3 text">
          <span>
            {/* Timer */}
            Time left: {("0" + Math.floor((time / 60000) % 60)).slice(-1)}:
            {("0" + Math.floor((time / 1000) % 60)).slice(-2)}s
          </span>
        </div>
        <div className="w-1/4 text ">WPM: {wpm}</div>
        <div className="w-1/3 text">Accuracy: {accuracy}%</div>
      </div>
    </div>
  );
}

export default TypingTest;
