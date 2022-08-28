import React from "react";

const Home = () => {
  return (
    <div name="home" className="w-full h-screen bg-[#0d47a1]">
      {/* Container */}
      <div className="mx-auto px-8 flex flex-col items-center justify-center h-full">
        <div>
          <button className=" text-white border-2 px-6 py-3 my-2  hover:bg-black">
            Begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
