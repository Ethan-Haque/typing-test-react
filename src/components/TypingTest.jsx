import React, { useState } from "react";
import useKeyPress from "../hooks/useKeyPress";

const words =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae pharetra libero.";
function TypingTest() {
  // padding to center text at beginning
  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(" ").join("")
  );
  // 3 stages for characters
  const [typedChars, setTypedChars] = useState("");
  const [currentChar, setCurrentChar] = useState(words.charAt(0));
  const [incomingChars, setIncomingChars] = useState(words.substring(1));

  useKeyPress((key) => {
    // temp vars
    let updatedTypedChars = typedChars;
    let updatedIncomingChars = incomingChars;

    // check for correct keystroke
    if (key === currentChar) {
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1)); // remove padding
      }

      // update stages
      updatedTypedChars += currentChar; // add current char to typed chars
      setTypedChars(updatedTypedChars);
      setCurrentChar(incomingChars.charAt(0)); // set curr char to next char
      updatedIncomingChars = incomingChars.substring(1); // remove new curr char from incoming
      setIncomingChars(updatedIncomingChars);
    }
  });

  return (
    <div name="home" className="w-full h-screen bg-[#0d47a1]">
      <div className="flex items-center text-[calc(10px_+_2vmin)] text-white justify-center h-screen">
        <p className="whitespace-pre">
          {/* typed chars */}
          <span className="text-[#ccd6f6]">
            {(leftPadding + typedChars).slice(-20)}
          </span>
          {/* current char */}
          <span className="bg-sky-500">{currentChar}</span>
          {/* Incoming chars */}
          <span>{incomingChars.substring(0, 20)}</span>
        </p>
      </div>
    </div>
  );
}

export default TypingTest;
