import React, { useState, useEffect } from "react";

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

  // 🔹 Trigger first and subsequent questions to update block sizes
  useEffect(() => {
    const { num1, num2 } = questions[currentQ];
    onNewQuestion(num1, num2);
    setUserAnswer(userAnswers[currentQ] || "");
  // eslint-disable-next-line
  }, [currentQ, questions]);

  const handleSubmit = () => {
    const correct = questions[currentQ].correct;
    let newAnswered = [...answered];
    let newUserAnswers = [...userAnswers];
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
    } else {
      // Already answered, just show feedback again
      if (Number(userAnswer) === correct) {
        setFeedback("✅ Correct!");
      } else {
        setFeedback(`❌ Wrong! Correct answer: ${correct}`);
      }
    }

    setTimeout(() => {
      setFeedback("");
      // Only auto-advance if not last question and not already finished
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
      } else if (newAnswered.every(Boolean)) {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    const newQs = Array.from({ length: 5 }, generateQuestion);
    setQuestions(newQs);
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
    }
  };

  return (
    <div className="mt-10 w-[90%] max-w-md bg-[#1b2330] text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-300">🔢 LCM Quiz</h2>

      {!quizFinished ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">
            Question {currentQ + 1} of {questions.length}: What is LCM of{" "}
            <span className="text-blue-400 font-bold">{questions[currentQ].num1}</span> and{" "}
            <span className="text-green-400 font-bold">{questions[currentQ].num2}</span>?
          </p>
          <p className="text-sm text-gray-200 mb-2 text-center">
            When the two blocks are at the same level, that's the LCM.<br />
            The height at that point is your answer.
          </p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-36 text-center px-2 py-1 rounded text-white"
            placeholder="Your answer"
            disabled={answered[currentQ]}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handlePrev}
              className={`bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-1 rounded ${currentQ === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentQ === 0}
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              className={`bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded ${answered[currentQ] ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={answered[currentQ]}
            >
              Submit
            </button>
            <button
              onClick={handleNext}
              className={`bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-1 rounded ${currentQ + 1 === questions.length ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentQ + 1 === questions.length}
            >
              Next
            </button>
          </div>
          {feedback && <p className="text-lg mt-2">{feedback}</p>}
          <p className="text-sm text-gray-300">Score: {score}</p>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-bold text-green-400 mb-2">🎉 Quiz Completed!</h3>
          <p className="text-lg mb-3">
            You scored {score} out of {questions.length}.
          </p>
          <button
            onClick={resetQuiz}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default LCMQuiz;
