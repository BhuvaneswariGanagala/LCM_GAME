import React, { useState, useEffect } from "react";

function getRandomNumber(difficulty) {
  let min, max;
  switch (difficulty) {
    case 'easy':
      min = 6;
      max = 12;
      break;
    case 'hard':
      min = 15;
      max = 24;
      break;
    default: // medium
      min = 8;
      max = 16;
      break;
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateFactors(number) {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

export default function FactorFinder({ onComplete, difficulty = 'medium', onAnswer }) {
  const [number, setNumber] = useState(12);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [showExample, setShowExample] = useState(true);
  const [gamePhase, setGamePhase] = useState('example'); // 'example', 'practice', 'complete'
  const [feedback, setFeedback] = useState("");
  const [correctFactors, setCorrectFactors] = useState([]);

  useEffect(() => {
    startNewQuestion();
  }, [difficulty]);

  const startNewQuestion = () => {
    const newNumber = getRandomNumber(difficulty);
    setNumber(newNumber);
    setSelectedFactors([]);
    setShowExample(true);
    setGamePhase('example');
    setFeedback("");
    setCorrectFactors(calculateFactors(newNumber));
  };

  const handleFactorClick = (factor) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const checkFactors = () => {
    const isCorrect = selectedFactors.length === correctFactors.length && 
                     selectedFactors.every(factor => correctFactors.includes(factor));
    
    if (isCorrect) {
      setFeedback("🎉 Perfect! You found all the factors correctly!");
      onAnswer && onAnswer(true);
      setTimeout(() => {
        setGamePhase('complete');
        onComplete && onComplete();
      }, 2000);
    } else {
      const missing = correctFactors.filter(f => !selectedFactors.includes(f));
      const extra = selectedFactors.filter(f => !correctFactors.includes(f));
      
      let message = "Not quite right. ";
      if (missing.length > 0) {
        message += `Missing factors: ${missing.join(', ')}. `;
      }
      if (extra.length > 0) {
        message += `These aren't factors: ${extra.join(', ')}.`;
      }
      
      setFeedback(message);
      onAnswer && onAnswer(false);
    }
  };

  const generateBlocks = (count) => {
    const blocks = [];
    for (let i = 1; i <= count; i++) {
      blocks.push(i);
    }
    return blocks;
  };

  const showFactorVisualization = (factor) => {
    const rows = Math.ceil(number / factor);
    const blocks = generateBlocks(number);
    
    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">{factor} × {number / factor} = {number}</h4>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${factor}, 1fr)`, maxWidth: '200px', margin: '0 auto' }}>
          {blocks.map((block, index) => (
            <div
              key={index}
              className="w-6 h-6 bg-blue-400 rounded text-xs flex items-center justify-center text-white font-semibold"
            >
              {block}
            </div>
          ))}
        </div>
        <p className="text-blue-700 text-sm mt-2">
          {factor} groups of {number / factor} blocks = {number} total blocks
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl px-8 py-6">
        <h1 className="text-3xl font-bold text-center">Factor Finder</h1>
        <p className="text-green-100 text-center mt-2">
          Learn to identify all factors of a number through visual exploration
        </p>
      </div>

      <div className="p-8">
        {/* Problem Statement */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Finding Factors of {number}
          </h2>
          <p className="text-gray-600">
            A factor is a number that divides evenly into another number
          </p>
        </div>

        {gamePhase === 'example' && (
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">📚 Example: How 1 is a factor</h3>
              {showFactorVisualization(1)}
              <div className="text-center">
                <button
                  onClick={() => setGamePhase('practice')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  I Understand - Let's Practice!
                </button>
              </div>
            </div>
          </div>
        )}

        {gamePhase === 'practice' && (
          <div className="space-y-8">
            {/* Factor Selection */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Select all factors of {number}
              </h3>
              
              <div className="grid grid-cols-6 gap-3 justify-center max-w-md mx-auto">
                {generateBlocks(number).map((num) => (
                  <button
                    key={num}
                    onClick={() => handleFactorClick(num)}
                    className={`w-12 h-12 rounded-lg border-2 text-center transition-all duration-300 font-semibold ${
                      selectedFactors.includes(num)
                        ? 'bg-green-500 border-green-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-gray-600 mb-2">
                  Selected factors: {selectedFactors.length > 0 ? selectedFactors.join(', ') : 'None'}
                </p>
                <button
                  onClick={checkFactors}
                  disabled={selectedFactors.length === 0}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
                >
                  Check My Answer
                </button>
              </div>
            </div>

            {/* Visual Factor Representation */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-4 text-center">
                Visual Factor Check
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedFactors.map((factor) => (
                  <div key={factor} className="text-center">
                    {showFactorVisualization(factor)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gamePhase === 'complete' && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 shadow-lg">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Excellent Work!</h3>
              <p className="text-green-700 text-lg mb-4">
                All factors of {number}: <span className="font-black text-xl">{correctFactors.join(', ')}</span>
              </p>
              <button
                onClick={startNewQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                Try Another Number
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`text-center p-4 rounded-lg border-2 mt-6 ${
            feedback.includes('Perfect') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="font-semibold text-lg">{feedback}</p>
          </div>
        )}

        {/* Hint Section */}
        <div className="text-center mt-6">
          <button
            onClick={() => setShowExample(!showExample)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            {showExample ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>

        {showExample && gamePhase === 'practice' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Hint:</h3>
            <p className="text-blue-700 text-sm">
              A factor divides evenly into {number}. Try dividing {number} by each number from 1 to {number}. 
              If there's no remainder, it's a factor!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
