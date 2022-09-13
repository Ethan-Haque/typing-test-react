import React, { useState, useEffect } from "react";
import useKeyPress from "../hooks/useKeyPress";
import { create, getAll } from '../utils/leaderboardAPI';

function TypingTest() {
  // states of game
  const STATES = {
    BEGIN: "BEGIN",
    TEST: "TEST",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
    SUBMIT: "SUBMIT",
    NAME: "NAME"
  };

  const [status, setStatus] = useState(STATES.BEGIN); // current state of game
  const [showMenu, setShowMenu] = useState(false);
  const [endMessage, setEndMessage] = useState("");

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

  // ui 
  const [invalidInput, setInvalidInput] = useState(false);
  const [topKey, setTopKey] = useState("m");
  const [topText, setTopText] = useState("Menu");


  useEffect(() => {
    document.body.style.overflow = "hidden"; // remove user scrolling

    // grab words for typing test
    fetch("http://metaphorpsum.com/paragraphs/1/6")
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
      setTime(JSON.parse(storedMilliseconds));
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
    setStatus(STATES.FAIL);
    clearVariables();
    setTopText("RESTART");
    setTopKey("CTRL+R");
    setShowMenu(false);
    setEndMessage("Ran out of time. Press CTRL + R to try again.");
  }

  useKeyPress((key) => {
    // temp vars
    let updatedTypedChars = typedChars;
    let updatedIncomingChars = incomingChars;

    if (status === STATES.BEGIN) {
      // Keyboard Menu
      if (key === "m") {
        setShowMenu(!showMenu);
      } else {
        if (showMenu) {
          switch (key) {
            case "a":
              changeTime(15000);
              break;
            case "s":
              changeTime(30000);
              break;
            case "d":
              changeTime(60000);
              break;
            case "j":
              changeSentenceCount(1);
              break;
            case "k":
              changeSentenceCount(2);
              break;
            case "l":
              changeSentenceCount(3);
              break;
            default:
              break;
          }
        }
      }
    }

    if (status === STATES.NAME) {
      if (key.length === 1 && key.match(/[a-z0-9]/i) && currentChar.length + 1 < 12) { // input
        // validate length of input
        if (currentChar.length + 1 < 3) {
          setInvalidInput(true);
        } else {
          setInvalidInput(false);
        }
        setCurrentChar(currentChar + key);
      } else if (key === "Backspace") { // delete input
        // validate length of input
        if (currentChar.length - 1 < 3) {
          setInvalidInput(true);
        } else {
          setInvalidInput(false);
        }
        setCurrentChar(currentChar.slice(0, -1));
      } else if (key === "Enter" && !invalidInput) { // submit input
        create({ "name": currentChar, "score": { "accuracy": accuracy, "wpm": wpm }, "mode": { "milliseconds": milliseconds, "sentenceCount": sentenceCount } });
        setStatus(STATES.SUCCESS);
        clearVariables();
        setEndMessage("Nice Job. Press CTRL + R to try again.");
      }

    } else if (key.length === 1) {

      // check for correct keystroke
      if (key === currentChar) {
        setInvalidInput(false);
        // modify padding to center current char
        if (leftPadding.length > 0) {
          setLeftPadding(leftPadding.substring(1));
        }
        if (incomingChars.length < 21) {
          setRightPadding(rightPadding + " ");
        }

        // update stages
        updatedTypedChars += currentChar; // add current char to typed chars
        setTypedChars(updatedTypedChars);
        setCurrentChar(incomingChars.charAt(0)); // set current char to next char
        updatedIncomingChars = incomingChars.substring(1); // remove new current char from incoming
        setIncomingChars(updatedIncomingChars);

        // calculate wpm
        if (status === STATES.TEST && key === " ") {
          setWpm(((wordCount + 1) / ((milliseconds - time) / 60000.0)).toFixed(2));
          setWordCount(wordCount + 1);
        }

        //  check for last character
        if (incomingChars.length === 0) {
          switch (status) {
            case STATES.BEGIN:
              // switch to TEST 
              setStatus(STATES.TEST);
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
              break;

            case STATES.TEST:
              // switch to SUBMIT 
              setStatus(STATES.SUBMIT);
              setTopText("RESTART");
              setTopKey("CTRL+R");
              setShowMenu(false);
              //count last word
              setWpm(((wordCount + 1) / ((milliseconds - time) / 60000.0)).toFixed(2));
              setWordCount(wordCount + 1);
              setWords("submit");

              // reset all variables
              setTimerOn(false);
              setLeftPadding("  Submit score? ");
              setRightPadding(new Array(11).fill(" ").join(""));
              setTypedChars("");
              setCurrentChar("s");
              setIncomingChars("ubmit");
              break;

            case STATES.SUBMIT:
              // switch to NAME 
              setStatus(STATES.NAME);
              // reset all variables
              setEndMessage("Name:  ");
              setLeftPadding("");
              setRightPadding(new Array(5).fill(" ").join(""));
              setTypedChars("");
              setCurrentChar("");
              setIncomingChars("");
              break;

            default:


          }
        }
      } else if (status !== STATES.BEGIN) {
        setInvalidInput(true);
      }
    }
    // log accuracy
    if (status === STATES.TEST && key.length === 1) {
      const updatedKeystrokes = keystrokes + 1;
      setKeystrokes(updatedKeystrokes);
      setAccuracy(
        ((updatedTypedChars.length * 100) / updatedKeystrokes).toFixed(2)
      );
    }
  });

  // reset all vars
  function clearVariables() {
    setTimerOn(false);
    setLeftPadding("");
    setRightPadding("");
    setTypedChars("");
    setCurrentChar("");
    setIncomingChars("");
  }

  function changeTime(amount) {
    // change current vars
    setTime(amount);
    setMilliseconds(amount);
    // save setting in local storage
    localStorage.setItem('milliseconds', amount);
  }

  function changeSentenceCount(amount) {
    // change current vars
    setSentenceCount(amount);
    // save setting in local storage
    localStorage.setItem('sentenceCount', amount);
  }

  return (
    <div name="test" className="flex flex-col justify-around items-center h-screen  text-white text-[2vmin] bg-[#0d47a1] gap-4">
      {/* Menu */}
      <div className="section text-white text-[calc(5px_+_2vmin)]">
        <div className={
          showMenu === true ? "opacity-100" : "opacity-0"
        }>
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
                changeTime(e.target.value * 1000);
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
                changeTime(e.target.value * 1000);
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
                changeTime(e.target.value * 1000);
              }}
            />
            <label htmlFor="time3" className="radio_label">
              60s
            </label>
          </div>
          {/* Timer Keys */}
          <div className="section">
            <div className="radio_keys"><span className="key">a</span></div>
            <div className="w-1/4 radio_keys"><span className="key">s</span></div>
            <div className="radio_keys"><span className="key">d</span></div>
          </div>
        </div>
        {/* Menu Button */}
        <div className="w-1/6 text">
          <button
            className={
              showMenu == null ? "h-[7rem] opacity-0" : " h-[7rem] opacity-100"
            }
            disabled={showMenu == null ? true : false}
            onClick={() => topText === "Menu" ? setShowMenu(!showMenu) : window.location.reload(false)}
          >
            <div>{topText}</div>
            <div className="key">{topKey}</div>
          </button>
        </div>

        <div className={
          showMenu === true ? "opacity-100" : "opacity-0"
        }>
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
                changeSentenceCount(e.target.value);
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
                changeSentenceCount(e.target.value);
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
                changeSentenceCount(e.target.value);
              }}
            />
            <label htmlFor="sentences3" className="radio_label">
              &nbsp;3&nbsp;
            </label>
          </div>
          {/* Sentence Count Keys */}
          <div className="section">
            <div className="radio_keys"><span className="key">j</span></div>
            <div className="w-1/4 radio_keys"><span className="key">k</span></div>
            <div className="radio_keys"><span className="key">l</span></div>
          </div>
        </div>
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
          <span className={
            invalidInput ? "bg-red-600" : "bg-sky-500"
          }>{currentChar}</span>
          {/* Everything to the right of current char */}
          <span>{incomingChars.substring(0, 20) + rightPadding}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="section text-[calc(6px_+_2vmin)]">
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
