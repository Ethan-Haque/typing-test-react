import React, { useState, useEffect } from "react";
import useKeyPress from "../hooks/useKeyPress";
// import { createOrUpdate } from '../utils/leaderboardAPI';
import { Link, scroller } from 'react-scroll';
import { MdKeyboard, MdLeaderboard } from "react-icons/md";

function TypingTest({ onScoreUpdate }) {
  // states of game
  const STATES = {
    BEGIN: "BEGIN",
    TEST: "TEST",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
    SUBMIT: "SUBMIT",
    NAME: "NAME",
    PASSWORD: "PASSWORD",
  };

  const themes = {
    grey: {
      "--bg-color": "#1a202c", // Dark Gray-Blue
      "--text-color": "#e2e8f0", // Light Gray
      "--highlight-color": "#38b2ac", // Teal
      "--incorrect-color": "#e53e3e", // Vivid Red
      "--typed-color": "#b7b7b7",
    },
    light: {
      "--bg-color": "#f7fafc", // Off-White
      "--text-color": "#2d3748", // Charcoal Gray
      "--highlight-color": "#e0e0e0", // Sky Blue
      "--incorrect-color": "#fc8181", // Soft Red
    },
    dark: {
      "--bg-color": "#000000",
      "--text-color": "#ffffff",
      "--highlight-color": "#1e90ff",
      "--incorrect-color": "#ff4500",
      "--typed-color": "#696969",
    }
  };


  // button link to other component
  const [otherComponentName, setOtherComponentName] = useState("leaderboard");

  const [status, setStatus] = useState(STATES.BEGIN); // current state of game
  const [showMenu, setShowMenu] = useState(false);
  const [endMessage, setEndMessage] = useState("");

  const [username, setUsername] = useState('');
  const [accountExists, setAccountExists] = useState(false);

  // words
  const [words, setWords] = useState("begin");
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(1);

  // time
  const [milliseconds, setMilliseconds] = useState(30000);
  const [time, setTime] = React.useState(milliseconds);
  const [timerOn, setTimerOn] = React.useState(false);
  const [startTime, setStartTime] = React.useState(null);

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
  const [theme, setTheme] = useState("grey");


  useEffect(() => {
    document.body.style.overflow = "hidden"; // remove user scrolling

    //set local values
    const storedTheme = localStorage.getItem('theme');
    const storedMilliseconds = localStorage.getItem('milliseconds');
    const storedSentenceCount = localStorage.getItem('sentenceCount');

    if (storedTheme) {
      switchTheme(storedTheme);
    }
    if (storedMilliseconds) {
      setMilliseconds(JSON.parse(storedMilliseconds));
      setTime(JSON.parse(storedMilliseconds));
    }
    if (storedSentenceCount) {
      setSentenceCount(JSON.parse(storedSentenceCount));
    }

    // grab words for test
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/sentences/3`, {
      headers: {
        'x-api-key': process.env.REACT_APP_WORD_API_KEY
      }
    })
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
        setTime(time + Math.floor((startTime.getTime() - new Date().getTime())));
      }, 100);
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  // timeout
  if (timerOn && time <= 0) {
    setStatus(STATES.FAIL);
    setTime(0);
    clearVariables();
    setTopText("RESTART");
    setTopKey("CTRL+R");
    setShowMenu(false);
    setEndMessage("Ran out of time. Press CTRL + R to try again.");
  }

  const switchTheme = (newTheme) => {
    setTheme(newTheme);
    Object.entries(themes[newTheme]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('theme', newTheme);
  };

  useKeyPress(async (key) => {
    // deny keypresses in leaderboard component
    if (otherComponentName === "test") {
      if (key === "r") {
        setOtherComponentName("leaderboard");
        scroller.scrollTo("test", {
          duration: 550,
          smooth: true,
        });
      }
      return;
    }

    // temp vars
    let updatedTypedChars = typedChars;
    let updatedIncomingChars = incomingChars;

    if (status === STATES.BEGIN) {
      // Keyboard Menu
      if (key === "m") {
        setShowMenu(!showMenu);
      } else if (key === "r") {
        switchPage();
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
            case "z":
              switchTheme("light");
              break;
            case "x":
              switchTheme("grey");
              break;
            case "c":
              switchTheme("dark");
            default:
              break;
          }
          return;
        }
      }
    } else if (status === STATES.SUCCESS || status === STATES.FAIL) {
      if (key === "r") {
        switchPage();
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
        const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/${currentChar}`, {
          headers: {
            'x-api-key': process.env.REACT_APP_WORD_API_KEY
          },
          credentials: 'include',
        });
        const data = await res.json();
        setTopKey("CTRL+R");
        if (data.exists) {
          setTopText("Welcome back, " + currentChar);
          setAccountExists(true);
        } else {
          setTopText("Thank you for joining " + currentChar);
          setAccountExists(false);
        }
        setUsername(currentChar);
        setStatus(STATES.PASSWORD);

        // reset all variables
        setEndMessage("Password:  ");
        setLeftPadding("");
        setRightPadding(new Array(5).fill(" ").join(""));
        setTypedChars("");
        setCurrentChar("");
        setIncomingChars("");
      }
    } else if (status === STATES.PASSWORD) {
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
        if (accountExists) {
          const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/login`, {
            method: 'POST',
            headers: {
              'x-api-key': process.env.REACT_APP_WORD_API_KEY,
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username: username, passcode: currentChar })
          });
          const data = await res.json();
          if (data.loggedIn) {
            submitScore();
          }
          else {
            setTopText(data.msg);
            setLeftPadding("");
            setRightPadding(new Array(5).fill(" ").join(""));
            setTypedChars("");
            setCurrentChar("");
            setIncomingChars("");
          }
        } else {
          const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user`, {
            method: 'POST',
            headers: {
              'x-api-key': process.env.REACT_APP_WORD_API_KEY,
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username: username, passcode: currentChar })
          });
          const data = await res.json();
          if (data.success) {
            submitScore();
          }
          else {
            setTopText(data.msg);
            setLeftPadding("");
            setRightPadding(new Array(5).fill(" ").join(""));
            setTypedChars("");
            setCurrentChar("");
            setIncomingChars("");
          }
        }
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
              setStartTime(new Date());
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
              const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/session`, {
                method: 'GET',
                credentials: 'include',  // Include cookies in the request
                headers: {
                  'x-api-key': process.env.REACT_APP_WORD_API_KEY
                }
              });
              const data = await res.json();
              if (data.loggedIn && data.username) { // session exists
                submitScore(data.username);
              } else {
                setStatus(STATES.NAME);
                // reset all variables
                setEndMessage("Name:  ");
                setLeftPadding("");
                setRightPadding(new Array(5).fill(" ").join(""));
                setTypedChars("");
                setCurrentChar("");
                setIncomingChars("");
              }
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

  function switchPage() {
    if (otherComponentName === "leaderboard") setOtherComponentName("test");
    else setOtherComponentName("leaderboard");
    scroller.scrollTo("leaderboard", {
      duration: 550,
      smooth: true,
    });
  }
  // submit score and set vars
  function submitScore() {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/score`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.REACT_APP_WORD_API_KEY,
        'Content-Type': 'application/json'
      },
      credentials: 'include',  // Include cookies in the request
      body: JSON.stringify({ "accuracy": accuracy, "wpm": wpm, "sentencecount": sentenceCount, "timer": milliseconds / 1000, })
    }).then(response => {
      onScoreUpdate();
      setStatus(STATES.SUCCESS);
      clearVariables();
      setTopText("Score Saved")
      setEndMessage("Nice Job. Press CTRL + R to try again.");
    });
  }
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
    <div name="test" className="flex flex-col justify-around items-center h-screen text-[2vmin] gap-4">
      {/* Menu */}
      <div className="section text-[calc(5px_+_2vmin)]">
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
          <Link to={otherComponentName} smooth={true} duration={550} ignoreCancelEvents={true} className={showMenu == null ? "hidden" : null}>
            <button onClick={() => otherComponentName === "leaderboard" ? setOtherComponentName("test") : setOtherComponentName("leaderboard")} disabled={showMenu == null ? true : false}
              className="fixed z-90 bottom-10 right-8 w-[calc(20px_+_4vmin)] h-[calc(20px_+_4vmin)] rounded-full drop-shadow-lg flex justify-center items-center text-[calc(4px_+_3vmin)]  hover:drop-shadow-2xl duration-500">
              {otherComponentName === "leaderboard" ?
                <MdLeaderboard />
                :
                <MdKeyboard />
              }<div className="ml-1 key text-[20px]">r</div>
            </button>
          </Link>
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
                changeSentenceCount(1);
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
                changeSentenceCount(2);
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
                changeSentenceCount(3);
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

      {/* Center (Theme/Typing Area) */}
      {showMenu ? (
        // Theme Menu
        <div className="absolute">
          <div className="section">
            <div className="text-[calc(1vmin_+_16px)]">Theme</div>
          </div>
          <div className="radio">
            <input
              type="radio"
              name="theme"
              value="light"
              id="themeLight"
              className="radio_input"
              checked={theme === "light"}
              onChange={() => switchTheme("light")}
            />
            <label htmlFor="themeLight" className="radio_label">
              &nbsp;Light&nbsp;
            </label>
            <input
              type="radio"
              name="theme"
              value="dark"
              id="themeDark"
              className="radio_input"
              checked={theme === "grey"}
              onChange={() => switchTheme("grey")}
            />
            <label htmlFor="themeDark" className="radio_label">
              &nbsp;Grey&nbsp;
            </label>
            <input
              type="radio"
              name="theme"
              value="blue"
              id="themeBlue"
              className="radio_input"
              checked={theme === "dark"}
              onChange={() => switchTheme("dark")}
            />
            <label htmlFor="themeBlue" className="radio_label">
              &nbsp;Dark&nbsp;
            </label>
          </div>

          {/* Theme Keys */}
          <div className="section">
            <div className="radio_keys">
              <span className="key">z</span>
            </div>
            <div className="w-1/4 radio_keys">
              <span className="key">x</span>
            </div>
            <div className="radio_keys">
              <span className="key">c</span>
            </div>
          </div>

        </div>
      )
        : (
          // Typing Area
          <div className="section text-[calc(20px_+_2vmin)] absolute">
            <div>{endMessage}</div>
            <p className="whitespace-pre">
              {/* Everything to the left of current char */}
              <span className="typed-color">
                {(leftPadding + typedChars).slice(-20)}
              </span>
              {/* current char */}
              <span className={
                invalidInput ? "incorrectCharColor" : "correctCharColor"
              }>
                {status !== STATES.PASSWORD ? (
                  currentChar
                ) : (
                  '*'.repeat(currentChar.length)
                )
                }
              </span>

              {/* Everything to the right of current char */}
              <span>{incomingChars.substring(0, 20) + rightPadding}</span>
            </p>
          </div>
        )}

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
