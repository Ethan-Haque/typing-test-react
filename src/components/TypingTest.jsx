import React, { useState, useEffect } from "react";
import useKeyPress from "../hooks/useKeyPress";

function TypingTest() {
  const [words, setWords] = useState("begin");
  const [testStart, setTestStart] = useState(false);
  const milliseconds = 30000;
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
    fetch("http://metaphorpsum.com/paragraphs/1/1")
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
          // reset all variables
          setLeftPadding(new Array(20).fill(" ").join(""));
          setRightPadding("");
          setTypedChars("");
          setCurrentChar(words.charAt(0));
          setIncomingChars(words.substring(1));
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
    <div className="flex flex-col justify-center items-center h-screen  text-white text-[2vmin] bg-[#0d47a1] gap-4">
      <div className=" text-center px-4 leading-loose ">{endMessage}</div>
      <div className="flex flex-wrap justify-center items-center gap-4 w-full  ">
        <div className=" w-1/4 text-center px-4 leading-loose ">
          <span>
            {/* Timer */}
            Time left: {("0" + Math.floor((time / 1000) % 60)).slice(-2)}s
          </span>
        </div>
        <div className=" w-1/4 text-center px-4 leading-loose pt-20 pb-20">
          WPM: {wpm}
        </div>
        <div className=" w-1/4 text-center px-4 leading-loose ">
          Accuracy: {accuracy}%
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 w-full text-[calc(10px_+_2vmin)]">
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
    </div>
  );
}

export default TypingTest;
