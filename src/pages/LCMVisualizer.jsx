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
    <div className="flex flex-col items-center bg-[#0e1624] min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-2 text-yellow-400">LCM FINDER</h1>
      
      <DadAndSonGame
        fatherBlock={fatherBlock}
        sonBlock={sonBlock}
        fatherStack={fatherStack}
        sonStack={sonStack}
        setFatherStack={setFatherStack}
        setSonStack={setSonStack}
      />

      {/* Quiz Section */}
      <LCMQuiz onNewQuestion={handleNewQuestion} />
    </div>
  );
};

export default LCMVisualizer;
