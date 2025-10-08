import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

const BLOCK_SCALE = 10; // smaller scale to fit larger LCMs
const INIT_STACK_HEIGHT = 60; // Initial small height for empty stack

// Helper to sum an array
const sum = arr => arr.reduce((a, b) => a + b, 0);

const DadAndSonGame = ({
  fatherBlock,
  sonBlock,
  fatherStack,
  sonStack,
  setFatherStack,
  setSonStack,
  currentQ, // <-- expects currentQ from parent (LCMQuiz)
  submitSignal, // <-- expects a prop that changes when submit is pressed
}) => {
  // Each stack is now a single array (no columns)
  const [fatherStackState, setFatherStackState] = useState([]);
  const [sonStackState, setSonStackState] = useState([]);

  // When props change (refresh), sync with parent if non-empty, else empty
  useEffect(() => {
    setFatherStackState(fatherStack.length ? [...fatherStack] : []);
    setSonStackState(sonStack.length ? [...sonStack] : []);
    // eslint-disable-next-line
  }, [fatherStack, sonStack]);

  // Reset stacks when question changes (move to next question)
  useEffect(() => {
    setFatherStackState([]);
    setSonStackState([]);
    setFatherStack([]);
    setSonStack([]);
    // eslint-disable-next-line
  }, [currentQ]);

  // Clear stacks after submitSignal changes (i.e., after submit)
  useEffect(() => {
    setFatherStackState([]);
    setSonStackState([]);
    setFatherStack([]);
    setSonStack([]);
    // eslint-disable-next-line
  }, [submitSignal]);

  // Refs for scrolling
  const fatherScrollRef = useRef(null);
  const sonScrollRef = useRef(null);

  // Totals
  const fatherTotal = sum(fatherStackState);
  const sonTotal = sum(sonStackState);

  // Stack heights and paddings
  const getBlocksHeight = stack => sum(stack) * BLOCK_SCALE;
  const getStackHeight = stack => (stack.length === 0 ? INIT_STACK_HEIGHT : getBlocksHeight(stack));
  const getPadding = stack => Math.max(0, getStackHeight(stack) - getBlocksHeight(stack));

  // Find the tallest stack (in px) among both father and son
  const getMaxStackHeight = () => {
    const fatherHeight = getBlocksHeight(fatherStackState);
    const sonHeight = getBlocksHeight(sonStackState);
    return Math.max(fatherHeight, sonHeight, INIT_STACK_HEIGHT);
  };

  // This is the max height of blocks (not including padding)
  const maxBlocksHeight = getMaxStackHeight();

  // Scroll to bottom on update
  useLayoutEffect(() => {
    if (fatherScrollRef.current) {
      fatherScrollRef.current.scrollTo({
        top: fatherScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    if (sonScrollRef.current) {
      sonScrollRef.current.scrollTo({
        top: sonScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [fatherStackState, sonStackState]);

  // Add block to father
  const addFatherBlock = () => {
    const newStack = [...fatherStackState, fatherBlock];
    setFatherStackState(newStack);
    setFatherStack(newStack);
  };

  // Add block to son
  const addSonBlock = () => {
    const newStack = [...sonStackState, sonBlock];
    setSonStackState(newStack);
    setSonStack(newStack);
  };

  // Render a stack
  // The stack should grow taller, not beside, as blocks are added
  const renderStack = (stack, color, scrollRef, label, total) => {
    const blocksHeight = getBlocksHeight(stack);
    const visibleHeight = blocksHeight > 0 ? blocksHeight : INIT_STACK_HEIGHT;
    const paddingTop = Math.max(0, visibleHeight - blocksHeight);

    return (
      <div className="flex flex-col items-center">
        <div
          ref={scrollRef}
          className="flex flex-col-reverse items-center overflow-y-auto border border-gray-400 rounded mt-2 w-20"
          style={{
            height: `${visibleHeight}px`,
            background: "#1b2330",
            paddingTop: `${paddingTop}px`,
            paddingBottom: 0,
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
            transition: "height 0.3s, padding-top 0.3s",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {stack.map((size, i) => (
            <div
              key={i}
              className={`w-full ${color} rounded mb-1 flex justify-center items-center text-white font-bold`}
              style={{ height: `${size * BLOCK_SCALE}px` }}
            >
              {size}
            </div>
          ))}
        </div>
        {label && (
          <>
            <div className="text-white mt-2 font-bold">{label}</div>
            <div className="text-gray-300 text-sm mt-1">Total: {total}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-32 items-end mb-6 w-full justify-center">
      {/* Father Section */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 100 140" width="80">
          <circle cx="50" cy="30" r="20" fill="#ffd7b3" />
          <path d="M30,25 Q50,5 70,25 Q60,10 30,25Z" fill="#553c2a" />
          <rect x="38" y="50" width="24" height="35" rx="6" fill="#5cb2d6" />
          <rect x="36" y="85" width="8" height="30" fill="#2f4964" />
          <rect x="56" y="85" width="8" height="30" fill="#2f4964" />
        </svg>
        {/* Only one stack, let it grow taller */}
        {renderStack(fatherStackState, "bg-blue-500", fatherScrollRef, "Father", fatherTotal)}
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          onClick={addFatherBlock}
        >
          Add Father Block
        </button>
      </div>

      {/* Son Section */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 100 120" width="60">
          <circle cx="50" cy="30" r="15" fill="#ffd7b3" />
          <path d="M35,25 Q50,10 65,25 Q55,15 35,25Z" fill="#f38f32" />
          <rect x="43" y="45" width="14" height="25" rx="5" fill="#62b6e8" />
          <rect x="40" y="70" width="6" height="25" fill="#354f7a" />
          <rect x="54" y="70" width="6" height="25" fill="#354f7a" />
        </svg>
        {/* Only one stack, let it grow taller */}
        {renderStack(sonStackState, "bg-green-500", sonScrollRef, "Son", sonTotal)}
        <button
          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onClick={addSonBlock}
        >
          Add Son Block
        </button>
      </div>
    </div>
  );
};

export default DadAndSonGame;