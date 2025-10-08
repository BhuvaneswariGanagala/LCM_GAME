import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

const BLOCK_SCALE = 10; // smaller scale to fit larger LCMs
const STACK_HEIGHT = 300; // px, must match max-h-[300px]
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
  // Each stack is now an array of arrays (columns)
  const [fatherStacks, setFatherStacks] = useState([[]]);
  const [sonStacks, setSonStacks] = useState([[]]);

  // When props change (refresh), sync with parent if non-empty, else empty
  useEffect(() => {
    if (fatherStack.length) {
      // Split the flat stack into columns of max height STACK_HEIGHT
      let columns = [];
      let current = [];
      let currentHeight = 0;
      for (let i = 0; i < fatherStack.length; i++) {
        const block = fatherStack[i];
        const blockHeight = block * BLOCK_SCALE;
        if (currentHeight + blockHeight > STACK_HEIGHT) {
          columns.push(current);
          current = [block];
          currentHeight = blockHeight;
        } else {
          current.push(block);
          currentHeight += blockHeight;
        }
      }
      if (current.length > 0) columns.push(current);
      setFatherStacks(columns.length ? columns : [[]]);
    } else {
      setFatherStacks([[]]);
    }
    if (sonStack.length) {
      let columns = [];
      let current = [];
      let currentHeight = 0;
      for (let i = 0; i < sonStack.length; i++) {
        const block = sonStack[i];
        const blockHeight = block * BLOCK_SCALE;
        if (currentHeight + blockHeight > STACK_HEIGHT) {
          columns.push(current);
          current = [block];
          currentHeight = blockHeight;
        } else {
          current.push(block);
          currentHeight += blockHeight;
        }
      }
      if (current.length > 0) columns.push(current);
      setSonStacks(columns.length ? columns : [[]]);
    } else {
      setSonStacks([[]]);
    }
    // eslint-disable-next-line
  }, [fatherStack, sonStack]);

  // Reset stacks when question changes (move to next question)
  useEffect(() => {
    // After moving to next question, empty the stack (like on refresh)
    setFatherStacks([[]]);
    setSonStacks([[]]);
    setFatherStack([]);
    setSonStack([]);
    // eslint-disable-next-line
  }, [currentQ]);

  // Clear stacks after submitSignal changes (i.e., after submit)
  useEffect(() => {
    setFatherStacks([[]]);
    setSonStacks([[]]);
    setFatherStack([]);
    setSonStack([]);
    // eslint-disable-next-line
  }, [submitSignal]);

  // Refs for each stack column
  const fatherScrollRefs = useRef([]);
  const sonScrollRefs = useRef([]);

  // Totals
  const fatherTotals = fatherStacks.map(stack => sum(stack));
  const sonTotals = sonStacks.map(stack => sum(stack));
  const fatherTotal = sum(fatherTotals);
  const sonTotal = sum(sonTotals);

  // Stack heights and paddings per column
  const getStackHeight = stack => (stack.length === 0 ? INIT_STACK_HEIGHT : STACK_HEIGHT);
  const getBlocksHeight = stack => sum(stack) * BLOCK_SCALE;
  const getPadding = stack => Math.max(0, getStackHeight(stack) - getBlocksHeight(stack));

  // Find the tallest stack (in px) among all columns for both father and son
  const getMaxStackHeight = () => {
    // Only consider non-empty columns for max height
    const allStacks = [...fatherStacks, ...sonStacks];
    let max = INIT_STACK_HEIGHT;
    for (let stack of allStacks) {
      const h = getBlocksHeight(stack);
      if (h > max) max = h;
    }
    // Clamp to STACK_HEIGHT
    return Math.min(max, STACK_HEIGHT);
  };

  // This is the max height of blocks (not including padding)
  const maxBlocksHeight = getMaxStackHeight();

  // Scroll to bottom on update
  useLayoutEffect(() => {
    fatherStacks.forEach((stack, i) => {
      fatherScrollRefs.current[i]?.scrollTo({
        top: fatherScrollRefs.current[i].scrollHeight,
        behavior: "smooth",
      });
    });
    sonStacks.forEach((stack, i) => {
      sonScrollRefs.current[i]?.scrollTo({
        top: sonScrollRefs.current[i].scrollHeight,
        behavior: "smooth",
      });
    });
  }, [fatherStacks, sonStacks]);

  // Add block to father
  const addFatherBlock = () => {
    let stacks = [...fatherStacks];
    let last = stacks[stacks.length - 1];
    const newBlockHeight = fatherBlock * BLOCK_SCALE;
    const lastStackHeight = getBlocksHeight(last);

    if (lastStackHeight + newBlockHeight > STACK_HEIGHT) {
      // Need new stack beside it
      stacks.push([fatherBlock]);
    } else {
      stacks[stacks.length - 1] = [...last, fatherBlock];
    }
    setFatherStacks(stacks);
    // Flatten all columns to update the parent stack
    setFatherStack(stacks.flat());
  };

  // Add block to son
  const addSonBlock = () => {
    let stacks = [...sonStacks];
    let last = stacks[stacks.length - 1];
    const newBlockHeight = sonBlock * BLOCK_SCALE;
    const lastStackHeight = getBlocksHeight(last);

    if (lastStackHeight + newBlockHeight > STACK_HEIGHT) {
      // Need new stack beside it
      stacks.push([sonBlock]);
    } else {
      stacks[stacks.length - 1] = [...last, sonBlock];
    }
    setSonStacks(stacks);
    setSonStack(stacks.flat());
  };

  // Render a stack column
  // The key change: use maxBlocksHeight for the stack container height and padding
  const renderStackColumn = (stack, idx, color, scrollRefs, label) => {
    // The visible height for all stacks is the same (maxBlocksHeight or INIT_STACK_HEIGHT)
    const visibleHeight = maxBlocksHeight > 0 ? maxBlocksHeight : INIT_STACK_HEIGHT;
    const blocksHeight = getBlocksHeight(stack);
    // Padding to push blocks to the bottom so all stacks align at the base
    const paddingTop = Math.max(0, visibleHeight - blocksHeight);

    return (
      <div key={idx} className="flex flex-col items-center">
        <div
          ref={el => (scrollRefs.current[idx] = el)}
          className="flex flex-col-reverse items-center overflow-y-auto border border-gray-400 rounded mt-2 w-20"
          style={{
            maxHeight: `${visibleHeight}px`,
            minHeight: `${visibleHeight}px`,
            background: "#1b2330",
            paddingTop: `${paddingTop}px`,
            paddingBottom: 0,
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
            transition: "max-height 0.3s, min-height 0.3s, padding-top 0.3s",
            marginLeft: idx === 0 ? 0 : "1.5rem",
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
        {label && idx === 0 && (
          <>
            <div className="text-white mt-2 font-bold">{label}</div>
            <div className="text-gray-300 text-sm mt-1">Total: {label === "Father" ? fatherTotal : sonTotal}</div>
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
        <div className="flex flex-row items-end">
          {fatherStacks.map((stack, idx) =>
            renderStackColumn(stack, idx, "bg-blue-500", fatherScrollRefs, idx === 0 ? "Father" : null)
          )}
        </div>
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
        <div className="flex flex-row items-end">
          {sonStacks.map((stack, idx) =>
            renderStackColumn(stack, idx, "bg-green-500", sonScrollRefs, idx === 0 ? "Son" : null)
          )}
        </div>
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