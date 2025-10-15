import React, { useState, useEffect } from "react";

// Helper functions
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

const generateQuestion = () => {
  const num1 = Math.floor(Math.random() * 9) + 2;
  const num2 = Math.floor(Math.random() * 9) + 2;
  return { num1, num2, correct: lcm(num1, num2) };
};

const LCMQuiz = ({ onNewQuestion }) => {
  const [questions, setQuestions] = useState(Array.from({ length: 5 }, generateQuestion));
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(Array(5).fill(false));
  const [userAnswers, setUserAnswers] = useState(Array(5).fill(""));

  // When question changes → update visualization (father-son game, etc.)
  useEffect(() => {
    const { num1, num2 } = questions[currentQ];
    onNewQuestion(num1, num2);
    setUserAnswer(userAnswers[currentQ] || "");
    // eslint-disable-next-line
  }, [currentQ, questions]);

  const handleSubmit = () => {
    const correct = questions[currentQ].correct;
    const newAnswered = [...answered];
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQ] = userAnswer;
    setUserAnswers(newUserAnswers);

    if (!answered[currentQ]) {
      if (Number(userAnswer) === correct) {
        setScore(score + 1);
        setFeedback("✅ Correct!");
      } else {
        setFeedback(`❌ Wrong! Correct answer: ${correct}`);
      }
      newAnswered[currentQ] = true;
      setAnswered(newAnswered);

      // If this was the last question and all answered → mark finished
      if (newAnswered.every(Boolean) && currentQ + 1 === questions.length) {
        setQuizFinished(true);
      }

      setTimeout(() => setFeedback(""), 1000);
    }
  };

  const resetQuiz = () => {
    setQuestions(Array.from({ length: 5 }, generateQuestion));
    setCurrentQ(0);
    setUserAnswer("");
    setScore(0);
    setQuizFinished(false);
    setFeedback("");
    setAnswered(Array(5).fill(false));
    setUserAnswers(Array(5).fill(""));
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setFeedback("");
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setFeedback("");
    } else if (answered.every(Boolean)) {
      setQuizFinished(true);
    }
  };

  const progress =
    questions.length > 1 ? Math.round((currentQ / (questions.length - 1)) * 100) : 0;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-all duration-300">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#023E8A] mb-4 text-center">
          🔢 LCM Quiz
        </h2>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!quizFinished ? (
          <div className="flex flex-col items-center gap-4">
            {/* Question Card */}
            <div className="p-4 w-full text-center bg-gradient-to-br from-[#eaf8ff] via-[#f0f4fa] to-[#e3ecf5] rounded-xl border border-[#A8D8EA] mb-2">
              <p className="text-base text-gray-600">
                Question{" "}
                <span className="text-[#0077B6] font-semibold">{currentQ + 1}</span> of{" "}
                <span className="text-[#0077B6] font-semibold">{questions.length}</span>
              </p>
              <p className="text-lg mt-2 text-[#005f8e]">
                What is the <span className="font-semibold text-[#0077B6]">LCM</span> of{" "}
                <span className="font-extrabold text-blue-500">
                  {questions[currentQ].num1}
                </span>{" "}
                and{" "}
                <span className="font-extrabold text-green-600">
                  {questions[currentQ].num2}
                </span>
                ?
              </p>
            </div>

            {/* Answer Input */}
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-40 text-center px-3 py-2 rounded-lg bg-[#f4f8fb] border border-[#0077B680] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0097b2] transition text-lg font-semibold"
              placeholder="Enter LCM"
              disabled={answered[currentQ]}
            />

            {/* Navigation & Submit Buttons */}
            <div className="flex justify-between mt-4 w-full">
              <button
                onClick={handlePrev}
                disabled={currentQ === 0}
                className={`px-4 py-2 rounded-lg font-semibold border border-gray-200 text-[#0f3b66]/80 bg-white hover:bg-gray-50 shadow-sm transition ${
                  currentQ === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                ⬅ Prev
              </button>

              <button
                onClick={handleSubmit}
                disabled={answered[currentQ]}
                className={`px-5 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:from-sky-600 hover:to-cyan-600 transition ${
                  answered[currentQ] ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit
              </button>

              <button
                onClick={handleNext}
                className={`px-4 py-2 rounded-lg font-semibold border border-gray-200 text-[#0f3b66]/80 bg-white hover:bg-gray-50 shadow-sm transition ${
                  currentQ + 1 === questions.length ? "opacity-50" : ""
                }`}
              >
                {currentQ + 1 === questions.length ? "Finish" : "Next ➡"}
              </button>
            </div>

            {/* Feedback */}
            {feedback && (
              <p
                className={`mt-3 text-base font-semibold ${
                  feedback.includes("✅") ? "text-green-600" : "text-red-600"
                } animate-pulse`}
              >
                {feedback}
              </p>
            )}

            {/* Score */}
            <div className="mt-2 flex items-center text-sm text-gray-600 gap-2">
              <span className="text-xl">🏆</span>
              <span>
                Score:{" "}
                <span className="font-bold text-[#0077B6]">
                  {score}
                </span>
              </span>
            </div>
          </div>
        ) : (
          // Quiz Finished Screen
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#0077B6] mb-2 animate-pulse">
              🎉 Quiz Completed!
            </h3>
            <p className="text-lg mb-4 text-gray-700">
              You scored{" "}
              <span className="text-[#0077B6] font-semibold">{score}</span> out of{" "}
              <span className="text-[#0077B6] font-semibold">{questions.length}</span>.
            </p>
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:from-sky-600 hover:to-cyan-600 transition"
            >
              Restart Quiz 🔁
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LCMQuiz;

