import React, { useState, useEffect } from "react";
import useKeyPress from "../hooks/useKeyPress";

function TypingTest() {
  const [milliseconds, setMilliseconds] = useState(30000);
  const [sentenceCount, setSentenceCount] = useState(1);
  const [words, setWords] = useState("begin");
  const [testStart, setTestStart] = useState(false);
  const [time, setTime] = React.useState(milliseconds);
  const [timerOn, setTimerOn] = React.useState(false);
  const [endMessage, setEndMessage] = useState("");
  const [accuracy, setAccuracy] = useState((100).toFixed(2));
  const [keystrokes, setKeystrokes] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);

  // padding to center text
  const [leftPadding, setLeftPadding] = useState("    ");
  const [rightPadding, setRightPadding] = useState("");

  // 3 stages for characters
  const [typedChars, setTypedChars] = useState("");
  const [currentChar, setCurrentChar] = useState(words.charAt(0));
  const [incomingChars, setIncomingChars] = useState(words.substring(1));

  // grab words for typing test
  useEffect(() => {
    fetch("http://metaphorpsum.com/paragraphs/1/6")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        setWords(data);
      });
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

      // calculate wpm
      if (incomingChars.charAt(0) === " ") {
        setWordCount(wordCount + 1);
        const durationInMinutes = (milliseconds - time) / 60000.0;
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }

      // update stages
      updatedTypedChars += currentChar; // add current char to typed chars
      setTypedChars(updatedTypedChars);
      setCurrentChar(incomingChars.charAt(0)); // set current char to next char
      updatedIncomingChars = incomingChars.substring(1); // remove new current char from incoming
      setIncomingChars(updatedIncomingChars);

      if (incomingChars.length === 0) {
        if (testStart) {
          // test ended
          clearVariables();
          setEndMessage("Nice Job. Press CTRL + R to try again.");
        } else {
          //start test
          setTestStart(true);
          setTimerOn(true);

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
      {/* Options */}
      <div className="section">
        <div className="text">{endMessage}</div>
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
        <div className="w-1/4 text">Show Options</div>
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
              console.log(e.target.value);
              console.log(sentenceCount);
            }}
          />
          <label htmlFor="sentences3" className="radio_label">
            &nbsp;3&nbsp;
          </label>
        </div>
      </div>

      {/* Typing Test */}
      <div className="section text-[calc(10px_+_2vmin)]">
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
      <div className="section">
        <div className="w-1/4 text">
          <span>
            {/* Timer */}
            Time left: {("0" + Math.floor((time / 60000) % 60)).slice(-1)}:
            {("0" + Math.floor((time / 1000) % 60)).slice(-2)}s
          </span>
        </div>
        <div className="w-1/4 text ">WPM: {wpm}</div>
        <div className="w-1/4 text">Accuracy: {accuracy}%</div>
      </div>
    </div>
  );
}

export default TypingTest;
