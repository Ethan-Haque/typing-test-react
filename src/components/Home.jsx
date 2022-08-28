import React, { useState, useEffect } from "react";

const Home = () => {
  const [typingText, setTypingText] = useState("begin");

  function handleClick() {
    // Text for typing test
    fetch("http://metaphorpsum.com/paragraphs/1/9")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        setTypingText(data);
      });
  }

  return (
    <div name="home" className="w-full h-screen bg-[#0d47a1]">
      {/* Container */}
      <div className="mx-auto px-8 flex flex-col items-center justify-center h-full">
        <div>
          <h2 className="text-xl  py-1 sm:text-2xl foxt-bold text-[#ccd6f6]">
            Type
          </h2>
          <h1 className="text-xl sm:text-3xl foxt-bold text-[#ffffff]">
            {typingText}
          </h1>
          <button onClick={handleClick}>Show text</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
