import React, { useState, useEffect } from "react";

function getRandomNumbers(difficulty) {
  let min, max;
  switch (difficulty) {
    case 'easy':
      min = 2;
      max = 8;
      break;
    case 'hard':
      min = 8;
      max = 20;
      break;
    default: // medium
      min = 3;
      max = 12;
      break;
  }
  
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  return [num1, num2];
}

function calculateLCM(a, b) {
  let max = Math.max(a, b);
  while (true) {
    if (max % a === 0 && max % b === 0) return max;
    max++;
  }
}

function generateMultiples(number, steps) {
  const multiples = [];
  for (let i = 1; i <= Math.max(steps, 8); i++) {
    multiples.push(i * number);
  }
  return multiples;
}

export default function QuestionCard({ onAnswer, difficulty = 'medium', gameStats }) {
  const [numbers, setNumbers] = useState([4, 6]);
  const [lcm, setLcm] = useState(12);
  const [playerAnswer, setPlayerAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [stepA, setStepA] = useState(0);
  const [stepB, setStepB] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gatesOpen, setGatesOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNumbers, setCustomNumbers] = useState([0, 0]);

  useEffect(() => {
    startNewAdventure();
  }, []);

  useEffect(() => {
    if (gameFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameFinished) {
      handleSubmit(false);
    }
  }, [timeLeft, gameFinished]);

  const startNewAdventure = () => {
    const [n1, n2] = getRandomNumbers(difficulty);
    setNumbers([n1, n2]);
    setLcm(calculateLCM(n1, n2));
    setStepA(0);
    setStepB(0);
    setPlayerAnswer("");
    setFeedback("");
    setGameFinished(false);
    setShowHint(false);
    setTimeLeft(30);
    setGatesOpen(false);
    setCurrentLevel(prev => prev + 1);
  };

  const handleNextStep = () => {
    const nextA = (stepA + 1) * numbers[0];
    const nextB = (stepB + 1) * numbers[1];
    setStepA(stepA + 1);
    setStepB(stepB + 1);

    // Check if both multiples match → LCM found
    if (nextA === nextB) {
      setGameFinished(true);
    }
  };

  const handleSubmit = (isCorrect = null) => {
    const correct = isCorrect !== null ? isCorrect : parseInt(playerAnswer) === lcm;
    
    if (correct) {
      setGatesOpen(true);
      setTreasureFound(true);
      setFeedback("🎉 MAGICAL! The gates open and treasure is yours!");
      onAnswer && onAnswer(true);
    } else {
      setFeedback(`💥 The gates remain locked. The magical number was ${lcm}.`);
      onAnswer && onAnswer(false);
    }

    setTimeout(() => startNewAdventure(), 4000);
  };

  const handleMultipleClick = (multipleValue) => {
    // Allow clicking on any visible multiple to select it
    setPlayerAnswer(multipleValue.toString());
  };

  const checkAnswer = () => {
    const selectedAnswer = parseInt(playerAnswer);
    const isCorrect = selectedAnswer === lcm;
    
    if (isCorrect) {
      setFeedback("🎉 Success! The LCM is correct!");
      setGatesOpen(true);
      onAnswer && onAnswer(true);
    } else {
      setFeedback(`❌ Incorrect. The correct LCM is ${lcm}.`);
      onAnswer && onAnswer(false);
      setTimeout(() => startNewAdventure(), 3000);
    }
  };

  const moveToNextQuestion = () => {
    startNewAdventure();
  };

  const handleCustomNumbers = () => {
    const [num1, num2] = customNumbers;
    if (num1 > 0 && num2 > 0) {
      setNumbers([num1, num2]);
      setLcm(calculateLCM(num1, num2));
      setStepA(0);
      setStepB(0);
      setPlayerAnswer("");
      setFeedback("");
      setGameFinished(false);
      setShowHint(false);
      setTimeLeft(30);
      setGatesOpen(false);
      setShowCustomInput(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl px-8 py-6">
        <h1 className="text-3xl font-bold text-center">LCM Finder</h1>
        <p className="text-blue-100 text-center mt-2">
          Find the Least Common Multiple by exploring the multiples of two numbers
        </p>
        
        {/* Custom Numbers Option */}
        <div className="text-center mt-4">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {showCustomInput ? 'Hide Custom Input' : 'Use Your Own Numbers'}
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Custom Numbers Input */}
        {showCustomInput && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">
              Enter Your Own Numbers
            </h3>
            <div className="flex justify-center items-center gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">First Number</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={customNumbers[0]}
                  onChange={(e) => setCustomNumbers([parseInt(e.target.value) || 0, customNumbers[1]])}
                  className="border-2 border-blue-300 rounded-lg px-3 py-2 text-center w-20 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <span className="text-2xl font-bold text-blue-600 mt-6">and</span>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Second Number</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={customNumbers[1]}
                  onChange={(e) => setCustomNumbers([customNumbers[0], parseInt(e.target.value) || 0])}
                  className="border-2 border-blue-300 rounded-lg px-3 py-2 text-center w-20 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={handleCustomNumbers}
                disabled={customNumbers[0] <= 0 || customNumbers[1] <= 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Use These Numbers
              </button>
            </div>
          </div>
        )}

        {/* Problem Statement */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Visualizing Multiples
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Find the LCM of <span className="font-bold text-blue-600">{numbers[0]}</span> and <span className="font-bold text-purple-600">{numbers[1]}</span>
          </p>
          <p className="text-gray-500">
            Click to reveal multiples and find the first number that appears in both sequences.
          </p>
        </div>

        {/* Multiples Visualization */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* First Number Multiples */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Multiples of {numbers[0]}</h3>
              <p className="text-gray-600 text-sm">Click to reveal each multiple</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap gap-3 justify-center">
                {generateMultiples(numbers[0], stepA).map((multiple, index) => {
                  const isCurrentStep = index === stepA - 1;
                  const isCommonMultiple = gameFinished && multiple === lcm;
                  const isVisible = index < stepA;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleMultipleClick(multiple)}
                      className={`w-12 h-12 rounded-lg border-2 text-center transition-all duration-300 font-semibold ${
                        playerAnswer === multiple.toString()
                          ? 'bg-blue-500 border-blue-600 text-white shadow-md scale-105'
                          : isCommonMultiple && gameFinished
                          ? gatesOpen 
                            ? 'bg-green-400 border-green-600 text-white shadow-lg animate-pulse'
                            : 'bg-orange-200 border-orange-400 text-orange-800 cursor-pointer hover:bg-orange-300 shadow-sm'
                          : isCurrentStep
                          ? 'bg-blue-100 border-blue-300 text-blue-700 cursor-pointer hover:bg-blue-200'
                          : isVisible
                          ? 'bg-gray-100 border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-200'
                          : 'bg-gray-50 border-gray-200 text-gray-400 cursor-default'
                      }`}
                      disabled={!isVisible}
                    >
                      {isVisible ? multiple : '?'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Second Number Multiples */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Multiples of {numbers[1]}</h3>
              <p className="text-gray-600 text-sm">Click to reveal each multiple</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap gap-3 justify-center">
                {generateMultiples(numbers[1], stepB).map((multiple, index) => {
                  const isCurrentStep = index === stepB - 1;
                  const isCommonMultiple = gameFinished && multiple === lcm;
                  const isVisible = index < stepB;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleMultipleClick(multiple)}
                      className={`w-12 h-12 rounded-lg border-2 text-center transition-all duration-300 font-semibold ${
                        playerAnswer === multiple.toString()
                          ? 'bg-purple-500 border-purple-600 text-white shadow-md scale-105'
                          : isCommonMultiple && gameFinished
                          ? gatesOpen 
                            ? 'bg-green-400 border-green-600 text-white shadow-lg animate-pulse'
                            : 'bg-orange-200 border-orange-400 text-orange-800 cursor-pointer hover:bg-orange-300 shadow-sm'
                          : isCurrentStep
                          ? 'bg-purple-100 border-purple-300 text-purple-700 cursor-pointer hover:bg-purple-200'
                          : isVisible
                          ? 'bg-gray-100 border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-200'
                          : 'bg-gray-50 border-gray-200 text-gray-400 cursor-default'
                      }`}
                      disabled={!isVisible}
                    >
                      {isVisible ? multiple : '?'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Gate Opening & Prize Section */}
        {gatesOpen && (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 shadow-lg">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h3>
              <p className="text-green-700 text-lg mb-4">
                You found the correct LCM: <span className="font-black text-2xl">{lcm}</span>
              </p>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-green-600 font-semibold">
                  🎯 Perfect! You've mastered finding the Least Common Multiple!
                </p>
                <p className="text-green-500 text-sm mt-2 mb-4">
                  Both sequences align at {lcm} - that's the LCM of {numbers[0]} and {numbers[1]}
                </p>
          <button
                  onClick={moveToNextQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
          >
                  Move to Next Question →
          </button>
              </div>
            </div>
          </div>
        )}

        {/* LCM Quiz Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">LCM Quiz</h2>
          
          {/* Problem Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 text-2xl font-bold text-gray-800">
              <span>LCM({numbers[0]}, {numbers[1]}) =</span>
            </div>
      </div>

          {/* Controls */}
          <div className="space-y-6">
            {!gameFinished ? (
              <div className="text-center">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
                  onClick={handleNextStep}
                >
                  Reveal Next Multiple
                </button>
                <p className="text-gray-600 mt-3">
                  Keep clicking to find the first common multiple
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold text-lg mb-2">
                  Common Multiple Found!
                </p>
                <p className="text-green-700 text-sm">
                  The LCM is <span className="font-bold text-lg">{lcm}</span>. Select this number and check your answer.
                </p>
              </div>
            )}

            {/* Answer Input Section */}
            {stepA > 0 && stepB > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 text-center mb-4">
                  {playerAnswer ? `Selected: ${playerAnswer}` : 'Click on any number above to select it, or enter manually'}
                </p>
                
                <div className="flex justify-center items-center gap-4">
          <input
            type="number"
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 text-center text-xl font-semibold w-24 bg-white focus:border-blue-500 focus:outline-none"
            value={playerAnswer}
            onChange={(e) => setPlayerAnswer(e.target.value)}
                    placeholder="?"
                    min="1"
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md flex items-center gap-2"
                    onClick={checkAnswer}
                    disabled={!playerAnswer}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Check Answer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hint Section */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            {showHint ? 'Hide Hint' : 'Get Hint'}
          </button>
        </div>

        {/* Hint Content */}
        {showHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Hint:</h3>
            <p className="text-blue-700 text-sm">
              The LCM is the smallest number that appears in both multiple sequences. 
              Keep revealing multiples until you find the first number that appears in both lists.
            </p>
        </div>
      )}

      {/* Feedback */}
        {feedback && (
          <div className={`text-center p-4 rounded-lg border-2 ${
            feedback.includes('Success') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="font-semibold text-lg mb-2">{feedback}</p>
            {feedback.includes('Success') ? (
              <button
                onClick={moveToNextQuestion}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
              >
                Move to Next Question →
              </button>
            ) : (
              <p className="text-sm opacity-75">Try again...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
