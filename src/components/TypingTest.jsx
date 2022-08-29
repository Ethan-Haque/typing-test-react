import React, { useState, useEffect } from "react";
import useKeyPress from "../hooks/useKeyPress";

function TypingTest() {
  const [words, setWords] = useState("begin");
  const [testStart, setTestStart] = useState(false);

  // padding to center text
  const [leftPadding, setLeftPadding] = useState("    ");
  const [rightPadding, setRightPadding] = useState("");

  // 3 stages for characters
  const [typedChars, setTypedChars] = useState("");
  const [currentChar, setCurrentChar] = useState(words.charAt(0));
  const [incomingChars, setIncomingChars] = useState(words.substring(1));

  // grab words for typing test on launch
  useEffect(() => {
    fetch("http://metaphorpsum.com/paragraphs/1/1")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        setWords(data);
      });
  }, []);
  
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
        setRightPadding(rightPadding + " ");  //add right padding
      }

      // update stages
      updatedTypedChars += currentChar; // add current char to typed chars
      setTypedChars(updatedTypedChars);
      setCurrentChar(incomingChars.charAt(0)); // set current char to next char
      updatedIncomingChars = incomingChars.substring(1); // remove new current char from incoming
      setIncomingChars(updatedIncomingChars);
      if (incomingChars.length === 0) {
        if (testStart) {
          alert("finished");
        } else {
          setTestStart(true);

          // reset all variables
          setLeftPadding(new Array(20).fill(" ").join(""));
          setRightPadding("");
          setTypedChars("");
          setCurrentChar(words.charAt(0));
          setIncomingChars(words.substring(1));
        }
      }
    }
  });

  return (
    <div name="home" className="w-full h-screen bg-[#0d47a1]">
      <div className="flex items-center text-[calc(10px_+_2vmin)] text-white justify-center h-screen">
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
