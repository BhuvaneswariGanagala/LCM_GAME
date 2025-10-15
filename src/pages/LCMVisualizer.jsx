import React, { useState } from "react";
import DadAndSonGame from "../components/DadAndSonGame";
import LCMQuiz from "../components/LCMQuiz";

const LCMVisualizer = () => {
  const [fatherBlock, setFatherBlock] = useState(2);
  const [sonBlock, setSonBlock] = useState(3);
  const [fatherStack, setFatherStack] = useState([]);
  const [sonStack, setSonStack] = useState([]);

  const handleNewQuestion = (num1, num2) => {
    setFatherBlock(num1);
    setSonBlock(num2);
    setFatherStack([]);
    setSonStack([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef4fa] to-[#e3ecf5] flex flex-col items-center justify-start py-10 px-5 font-[Inter] text-gray-800">

      {/* Heading & How to Play */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f3b66] mb-3 tracking-tight">
          Visualizing LCM
        </h1>
        <p className="text-[#0f3b66]/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          How to play: Build each stack using its block size until both stacks reach the same height, then place the bridge and walk across.
        </p>
      </div>

      {/* Game Panel */}
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 flex flex-col items-center mb-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#023E8A] mb-2 text-center">
          Dad & Son Stacking Game
        </h2>

        <div className="flex items-end justify-center gap-20 w-full min-h-[300px] md:min-h-[360px]">
          <DadAndSonGame
            fatherBlock={fatherBlock}
            sonBlock={sonBlock}
            fatherStack={fatherStack}
            sonStack={sonStack}
            setFatherStack={setFatherStack}
            setSonStack={setSonStack}
          />
        </div>

        <p className="mt-5 text-gray-500 text-sm md:text-base text-center italic max-w-lg">
          Tip: The equal height where they meet is the <span className="font-medium text-[#0077B6]">Least Common Multiple</span>.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full max-w-5xl flex items-center gap-4 mb-8 px-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </div>

      {/* Question & Answer (Quiz) */}
      {/* <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-all duration-300"> */}
        <LCMQuiz onNewQuestion={handleNewQuestion} />
      {/* </div> */}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bhuvana A full stack developer — Designed to make math concepts visual, simple, and fun.
      </footer>
    </div>
  );
};

export default LCMVisualizer;
