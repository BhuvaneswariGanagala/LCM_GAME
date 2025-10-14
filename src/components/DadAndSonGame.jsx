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
        <svg viewBox="0 0 110 160" width="90" aria-label="Father avatar">
          {/* Dad head (slightly smaller to fit cap) */}
          <circle cx="55" cy="36" r="24" fill="#FFD7AF" />
          {/* Cap (top dome) - draw after head so it appears in front */}
          <ellipse cx="55" cy="26" rx="26" ry="13" fill="#4EB1C9" />
          {/* Cap brim */}
          <rect x="36" y="30" width="38" height="7" rx="3.5" fill="#3A94AB" />
          {/* Ear */}
          <circle cx="78" cy="38" r="5" fill="#FFD7AF" />
          {/* Eyes */}
          <circle cx="49" cy="40" r="2" fill="#2A2A2A" />
          <circle cx="61" cy="40" r="2" fill="#2A2A2A" />
          {/* Smile */}
          <path d="M46,46 Q55,50 64,46" stroke="#A65C3A" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Neck */}
          <rect x="50" y="60" width="10" height="8" rx="4" fill="#FFD7AF" />
          {/* Body (teal shirt) */}
          <rect x="38" y="66" width="34" height="28" rx="10" fill="#4EB1C9" />
          {/* Arms */}
          <rect x="32" y="70" width="8" height="14" rx="4" fill="#FFD7AF" />
          <rect x="70" y="70" width="8" height="14" rx="4" fill="#FFD7AF" />
          <circle cx="36" cy="84" r="3" fill="#FFD7AF" />
          <circle cx="74" cy="84" r="3" fill="#FFD7AF" />
          {/* Shorts */}
          <rect x="40" y="94" width="12" height="12" rx="3" fill="#51606F" />
          <rect x="58" y="94" width="12" height="12" rx="3" fill="#51606F" />
          {/* Legs */}
          <rect x="42" y="106" width="8" height="18" rx="3" fill="#FFD7AF" />
          <rect x="60" y="106" width="8" height="18" rx="3" fill="#FFD7AF" />
          {/* Shoes */}
          <rect x="39" y="124" width="14" height="6" rx="3" fill="#2F2F2F" />
          <rect x="59" y="124" width="14" height="6" rx="3" fill="#2F2F2F" />
        </svg>
        {/* Only one stack, let it grow taller */}
        {renderStack(fatherStackState, "bg-blue-500", fatherScrollRef, "Father", fatherTotal)}
        <button
          className="mt-3 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
          onClick={addFatherBlock}
        >
          Add Father Block
        </button>
      </div>

      {/* Son Section */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 100 135" width="70" aria-label="Son avatar">
          {/* Son head (slightly smaller to fit cap) */}
          <circle cx="50" cy="32" r="18" fill="#FFD7AF" />
          {/* Cap (top dome) - draw after head so it appears in front */}
          <ellipse cx="50" cy="23" rx="22" ry="11" fill="#4EB1C9" />
          {/* Cap brim */}
          <rect x="36" y="26" width="28" height="6" rx="3" fill="#3A94AB" />
          {/* Ear */}
          <circle cx="66" cy="34" r="4" fill="#FFD7AF" />
          {/* Eyes */}
          <circle cx="44" cy="36" r="1.7" fill="#2A2A2A" />
          <circle cx="56" cy="36" r="1.7" fill="#2A2A2A" />
          {/* Smile */}
          <path d="M42,41 Q50,45 58,41" stroke="#A65C3A" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Neck */}
          <rect x="46" y="52" width="8" height="6" rx="3" fill="#FFD7AF" />
          {/* Body (teal shirt) */}
          <rect x="41" y="56" width="18" height="22" rx="8" fill="#4EB1C9" />
          {/* Arms */}
          <rect x="35" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
          <rect x="59" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
          <circle cx="38" cy="68" r="2.6" fill="#FFD7AF" />
          <circle cx="62" cy="68" r="2.6" fill="#FFD7AF" />
          {/* Shorts */}
          <rect x="42" y="78" width="8" height="10" rx="3" fill="#51606F" />
          <rect x="50" y="78" width="8" height="10" rx="3" fill="#51606F" />
          {/* Legs */}
          <rect x="43" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
          <rect x="51" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
          {/* Shoes */}
          <rect x="40" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
          <rect x="52" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
        </svg>
        {/* Only one stack, let it grow taller */}
        {renderStack(sonStackState, "bg-green-500", sonScrollRef, "Son", sonTotal)}
        <button
          className="mt-3 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
          onClick={addSonBlock}
        >
          Add Son Block
        </button>
      </div>
    </div>
  );
};

export default DadAndSonGame;