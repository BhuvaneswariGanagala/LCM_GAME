import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import FactorFinder from "./components/FactorFinder";
import "./index.css";

const App = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    difficulty: 'medium'
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [currentGame, setCurrentGame] = useState('menu'); // 'menu', 'factors', 'lcm'

  const updateScore = (isCorrect) => {
    setGameState(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      score: prev.score + (isCorrect ? 10 : 0),
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      bestStreak: isCorrect && prev.currentStreak + 1 > prev.bestStreak ? prev.currentStreak + 1 : prev.bestStreak
    }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      difficulty: 'medium'
    });
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const changeDifficulty = (difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            Math Explorer
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Interactive learning games for factors and LCM
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Factor Finder Game */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h2 className="text-xl font-bold text-green-800 mb-3">🔢 Factor Finder</h2>
              <p className="text-green-700 text-sm mb-4">
                Learn to identify all factors of a number through visual exploration
              </p>
              <button
                onClick={() => {
                  setCurrentGame('factors');
                  setGameStarted(true);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Start Factor Game
              </button>
            </div>

            {/* LCM Finder Game */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-blue-800 mb-3">🎯 LCM Finder</h2>
              <p className="text-blue-700 text-sm mb-4">
                Find the Least Common Multiple by exploring multiples
              </p>
              <button
                onClick={() => {
                  setCurrentGame('lcm');
                  setGameStarted(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Start LCM Game
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Choose Difficulty:</h3>
            <div className="flex justify-center gap-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => changeDifficulty(level)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    gameState.difficulty === level
                      ? 'bg-gray-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header with Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-800">LCM Learning Progress</h1>
            <div className="flex gap-8 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600 text-lg">{gameState.score}</div>
                <div className="text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600 text-lg">{gameState.correctAnswers}/{gameState.questionsAnswered}</div>
                <div className="text-gray-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600 text-lg">{gameState.currentStreak}</div>
                <div className="text-gray-500">Streak</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600 text-lg">{gameState.bestStreak}</div>
                <div className="text-gray-500">Best</div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Game Selection */}
        {currentGame === 'factors' && (
          <FactorFinder 
            onAnswer={updateScore} 
            difficulty={gameState.difficulty}
            onComplete={() => {
              // Factor game completed, could transition to LCM
              console.log('Factor game completed');
            }}
          />
        )}

        {currentGame === 'lcm' && (
          <QuestionCard 
            onAnswer={updateScore} 
            difficulty={gameState.difficulty}
            gameStats={gameState}
          />
        )}

        {/* Back to Menu Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setGameStarted(false);
              setCurrentGame('menu');
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
