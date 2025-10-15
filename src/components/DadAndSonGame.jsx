import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

const BLOCK_SCALE = 10;
const INIT_STACK_HEIGHT = 60;
const BRIDGE_ANIMATION_DURATION = 2000; // ms
const BRIDGE_THICKNESS = 24; // px
const FINAL_SON_STAND_DELTA = 10; // px: nudge to ensure same-level appearance beside father

const sum = arr => arr.reduce((a, b) => a + b, 0);

const BridgeSVG = ({ height = 20 }) => (
  <svg viewBox="0 0 100 100" width="100%" height={height} preserveAspectRatio="none" aria-label="Bridge">
    {/* Full-height plank */}
    <rect x="2" y="0" width="96" height="100" rx="8" fill="#795548" />
    {/* Top/bottom highlights */}
    <rect x="2" y="0" width="96" height="8" rx="4" fill="#a1887f" opacity="0.7" />
    <rect x="2" y="92" width="96" height="8" rx="4" fill="#5d4037" opacity="0.4" />
    {/* Slats, scaled across width */}
    {[...Array(4)].map((_, i) => (
      <rect key={i} x={12 + i * 22} y="10" width="6" height="80" rx="3" fill="#bcaaa4" opacity="0.7" />
    ))}
  </svg>
);

const DadAndSonGame = ({
  fatherBlock,
  sonBlock,
  fatherStack,
  sonStack,
  setFatherStack,
  setSonStack,
  currentQ,
  submitSignal,
}) => {
  // States for stacks and animation
  const [fatherStackState, setFatherStackState] = useState([]);
  const [sonStackState, setSonStackState] = useState([]);
  const [showBridge, setShowBridge] = useState(false);
  const [sonWalking, setSonWalking] = useState(false);
  const [sonWalked, setSonWalked] = useState(false);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [bridgeEditable, setBridgeEditable] = useState(false);
  const [dragging, setDragging] = useState(null); // 'left' | 'right' | null
  const [bridgeMessage, setBridgeMessage] = useState("");

  const fatherScrollRef = useRef(null);
  const sonScrollRef = useRef(null);
  const dadAvatarRef = useRef(null);
  const dadContainerRef = useRef(null);
  const sonAvatarRef = useRef(null);

  // Helper functions for height
  const getBlocksHeight = stack => sum(stack) * BLOCK_SCALE;
  // Visual stack height adds the 4px gap (Tailwind mb-1) between blocks
  const getVisualBlocksHeight = stack => getBlocksHeight(stack) + Math.max(0, stack.length - 1) * 4;
  const getStackHeight = stack =>
    (stack.length === 0 ? INIT_STACK_HEIGHT : getBlocksHeight(stack));
  const getMaxStackHeight = () => {
    const fatherHeight = getBlocksHeight(fatherStackState);
    const sonHeight = getBlocksHeight(sonStackState);
    return Math.max(fatherHeight, sonHeight, INIT_STACK_HEIGHT);
  };
  const maxBlocksHeight = getMaxStackHeight();

  // Totals for label
  const fatherTotal = sum(fatherStackState);
  const sonTotal = sum(sonStackState);

  // Keep state in sync with props
  useEffect(() => {
    setFatherStackState(fatherStack.length ? [...fatherStack] : []);
    setSonStackState(sonStack.length ? [...sonStack] : []);
    // eslint-disable-next-line
  }, [fatherStack, sonStack]);

  // Full reset on question change
  useEffect(() => {
    setFatherStackState([]);
    setSonStackState([]);
    setFatherStack([]);
    setSonStack([]);
    setBridgeReady(false);
    setShowBridge(false);
    setBridgeEditable(false);
    setSonWalking(false);
    setSonWalked(false);
    // Reset computed positions so avatars/bridge go back to defaults
    setBridgePos({ left: 0, width: 0, bottom: 0 });
    setPositions({ leftSon: 0, leftDad: 0 });
    // eslint-disable-next-line
  }, [currentQ]);

  // UI-only reset on submit (keep stacks, just return son to his side)
  useEffect(() => {
    setBridgeReady(false);
    setShowBridge(false);
    setBridgeEditable(false);
    setSonWalking(false);
    setSonWalked(false);
    setBridgePos({ left: 0, width: 0, bottom: 0 });
    setPositions({ leftSon: 0, leftDad: 0 });
    // eslint-disable-next-line
  }, [submitSignal]);

  // Defensive: if there's no bridge and no walking, ensure son is not considered "walked"
  useEffect(() => {
    if (!showBridge && !sonWalking && sonWalked) {
      setSonWalked(false);
    }
  }, [showBridge, sonWalking, sonWalked]);

  // Scroll effect for stacks
  useLayoutEffect(() => {
    if (fatherScrollRef.current)
      fatherScrollRef.current.scrollTo({
        top: fatherScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    if (sonScrollRef.current)
      sonScrollRef.current.scrollTo({
        top: sonScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [fatherStackState, sonStackState]);

  // Add blocks
  const addFatherBlock = () => {
    if (bridgeReady || sonWalking) return;
    const newStack = [...fatherStackState, fatherBlock];
    setFatherStackState(newStack);
    setFatherStack(newStack);
  };
  const addSonBlock = () => {
    if (bridgeReady || sonWalking) return;
    const newStack = [...sonStackState, sonBlock];
    setSonStackState(newStack);
    setSonStack(newStack);
  };

  // Logic: keep bridge hidden when heights differ; no auto-show
  useEffect(() => {
    const stacksEqual =
      fatherStackState.length > 0 &&
      sonStackState.length > 0 &&
      getBlocksHeight(fatherStackState) === getBlocksHeight(sonStackState);

    if (!stacksEqual) {
      setShowBridge(false);
      setBridgeReady(false);
      setBridgeEditable(false);
      return;
    }
    // eslint-disable-next-line
  }, [fatherStackState, sonStackState]);

  const handleAddBridge = () => {
    const equal =
      fatherStackState.length > 0 &&
      sonStackState.length > 0 &&
      getBlocksHeight(fatherStackState) === getBlocksHeight(sonStackState);
    if (equal) {
      setBridgeReady(true);
      setShowBridge(true);
      setBridgeEditable(true);
      setBridgeMessage("");
    } else {
      setBridgeMessage("Heights are not the same. Try again.");
      setTimeout(() => setBridgeMessage(""), 2000);
    }
  };

  // Stack rendering (bridge is no longer inside the stack itself)
  const renderStack = (stack, color, scrollRef, label, total) => {
    const blocksHeight = getBlocksHeight(stack);
    const visibleHeight = blocksHeight > 0 ? blocksHeight : INIT_STACK_HEIGHT;
    const paddingTop = Math.max(0, visibleHeight - blocksHeight);

    return (
      <div className="flex flex-col items-center">
        <div
          ref={scrollRef}
          className="flex flex-col-reverse items-center overflow-y-auto border border-gray-300 rounded-lg mt-2 w-20 bg-[#f4f8fb]"
          style={{
            height: `${visibleHeight}px`,
            paddingTop: `${paddingTop}px`,
            transition: "height 0.3s, padding-top 0.3s",
            boxSizing: "border-box",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          {/* Bridge is now rendered OUTSIDE this stack container */}
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

  // Son walking animation: moves horizontally, above the blocks
  const SonWalking = ({ from, to, yOffset }) => {
    const [move, setMove] = useState(false);
    useEffect(() => {
      // Defer to next frame to allow initial render at `from`, then animate to `to`
      const id = requestAnimationFrame(() => setMove(true));
      return () => cancelAnimationFrame(id);
    }, []);
    return (
      <div
        style={{
          position: "absolute",
          bottom: `${yOffset}px`,
          left: move ? `${to}px` : `${from}px`,
          transition: `left ${BRIDGE_ANIMATION_DURATION}ms cubic-bezier(.5,1.3,.5,1), opacity 0.3s`,
          zIndex: 100,
          width: 80,
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 100 135" width="70" aria-label="Son walking">
          <circle cx="50" cy="32" r="18" fill="#FFD7AF" />
          <ellipse cx="50" cy="23" rx="22" ry="11" fill="#4EB1C9" />
          <rect x="36" y="26" width="28" height="6" rx="3" fill="#3A94AB" />
          <circle cx="66" cy="34" r="4" fill="#FFD7AF" />
          <circle cx="44" cy="36" r="1.7" fill="#2A2A2A" />
          <circle cx="56" cy="36" r="1.7" fill="#2A2A2A" />
          <path d="M42,41 Q50,45 58,41" stroke="#A65C3A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="46" y="52" width="8" height="6" rx="3" fill="#FFD7AF" />
          <rect x="41" y="56" width="18" height="22" rx="8" fill="#4EB1C9" />
          <rect x="35" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
          <rect x="59" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
          <circle cx="38" cy="68" r="2.6" fill="#FFD7AF" />
          <circle cx="62" cy="68" r="2.6" fill="#FFD7AF" />
          <rect x="42" y="78" width="8" height="10" rx="3" fill="#51606F" />
          <rect x="50" y="78" width="8" height="10" rx="3" fill="#51606F" />
          <rect x="43" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
          <rect x="51" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
          <rect x="40" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
          <rect x="52" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
        </svg>
      </div>
    );
  };

  // Positioning math for animation and for bridge
  const containerRef = useRef(null);
  const [positions, setPositions] = useState({ leftSon: 0, leftDad: 0 });
  useLayoutEffect(() => {
    if (!containerRef.current || !fatherScrollRef.current || !sonScrollRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const dadRect = fatherScrollRef.current.getBoundingClientRect();
    const sonRect = sonScrollRef.current.getBoundingClientRect();
    // Center the walking avatar (70px width) over each 80px-wide stack box
    const sonLeft = sonRect.left - parentRect.left + Math.max(0, (sonRect.width - 70) / 2);
    const dadLeft = dadRect.left - parentRect.left + Math.max(0, (dadRect.width - 70) / 2);
    setPositions({
      leftSon: sonLeft,
      leftDad: dadLeft,
    });
  }, [
    fatherStackState, sonStackState, showBridge, sonWalking, sonWalked, maxBlocksHeight
  ]);

  // Default yOffset for walking (fallback): top of stacks level if avatars aren't measurable
  const fallbackYOffset = Math.max(
    fatherStackState.length ? getVisualBlocksHeight(fatherStackState) : INIT_STACK_HEIGHT,
    sonStackState.length ? getVisualBlocksHeight(sonStackState) : INIT_STACK_HEIGHT
  );

  // The Y offset for the bridge: right above the highest block
  // Since the fatherStack and sonStack are parallel visually, their bottoms are aligned.
  // Place bridge absolute to parent, horizontally centered over both Son and Father
  // To get horizontal position, use left of son block & dad block, width = distance between + stack width
  const [bridgePos, setBridgePos] = useState({
    left: 0,
    width: 0,
    bottom: 0,
  });

  // Compute son's final standing vertical offset to match father's feet inside father container
  const [finalSonBottom, setFinalSonBottom] = useState(0);
  useLayoutEffect(() => {
    if (!dadContainerRef.current || !dadAvatarRef.current) return;
    const cont = dadContainerRef.current.getBoundingClientRect();
    const avatar = dadAvatarRef.current.getBoundingClientRect();
    setFinalSonBottom(Math.max(0, cont.bottom - avatar.bottom));
  }, [fatherStackState, sonStackState, sonWalked, sonWalking, showBridge]);

  useLayoutEffect(() => {
    if (!containerRef.current || !fatherScrollRef.current || !sonScrollRef.current || !showBridge) {
      setBridgePos({ left: 0, width: 0, bottom: 0 });
      return;
    }
    const parentRect = containerRef.current.getBoundingClientRect();
    const dadRect = fatherScrollRef.current.getBoundingClientRect();
    const sonRect = sonScrollRef.current.getBoundingClientRect();

    // Bridge spans exactly from the outer edge of one stack box to the other
    const leftEdge = Math.min(dadRect.left, sonRect.left) - parentRect.left;
    const rightEdge = Math.max(dadRect.right, sonRect.right) - parentRect.left;
    const left = leftEdge;
    const width = rightEdge - leftEdge;

    // Compute target bottom so bridge sits just below the avatars' feet
    const dadAvatar = dadAvatarRef.current?.getBoundingClientRect();
    const sonAvatar = sonAvatarRef.current?.getBoundingClientRect();
    // distance from container bottom up to avatar feet (approximate: avatarRect.bottom - parentRect.bottom is negative)
    const dadFeetBottom = dadAvatar ? (parentRect.bottom - dadAvatar.bottom) : null;
    const sonFeetBottom = sonAvatar ? (parentRect.bottom - sonAvatar.bottom) : null;
    // choose the smaller (lower) to ensure bridge is below both sets of feet, add a small gap
    const feetBottom = (dadFeetBottom != null && sonFeetBottom != null)
      ? Math.max(0, Math.min(dadFeetBottom, sonFeetBottom) + 4)
      : Math.max(0, fallbackYOffset - BRIDGE_THICKNESS);

    setBridgePos(prev => ({
      left: bridgeEditable ? (prev.width ? prev.left : left) : left,
      width: bridgeEditable ? (prev.width ? prev.width : width) : width,
      bottom: feetBottom,
    }));
  }, [showBridge, containerRef, fatherStackState, sonStackState, maxBlocksHeight]);

  // Drag handlers for bridge handles
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging || !containerRef.current) return;
      const parentRect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - parentRect.left;
      setBridgePos(prev => {
        if (dragging === 'left') {
          const newLeft = Math.min(Math.max(0, x), prev.left + prev.width - 40);
          const newWidth = prev.width + (prev.left - newLeft);
          return { ...prev, left: newLeft, width: newWidth };
        }
        if (dragging === 'right') {
          const newWidth = Math.max(40, x - prev.left);
          return { ...prev, width: newWidth };
        }
        return prev;
      });
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  // Whether the son is allowed to walk across right now
  const canWalk =
    showBridge &&
    !sonWalked &&
    !sonWalking &&
    getBlocksHeight(fatherStackState) === getBlocksHeight(sonStackState) &&
    getBlocksHeight(fatherStackState) > 0;

  return (
    <div
      className="flex gap-32 items-end mb-6 w-full justify-center relative"
      ref={containerRef}
      style={{ minHeight: 340 + Math.max(getStackHeight(fatherStackState), getStackHeight(sonStackState)) }}
    >
      <div
        style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)' }}
        className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-sm text-[#0f3b66]/80 shadow-sm backdrop-blur"
      >
        Tip: Build equal heights, add the bridge, then walk across.
      </div>
      {/* Bridge above the stacks BETWEEN the Son and Father! */}
      {showBridge && (
        <div
          style={{
            position: "absolute",
            left: `${bridgePos.left}px`,
            width: `${bridgePos.width}px`,
            bottom: `${bridgePos.bottom}px`,
            height: `${BRIDGE_THICKNESS}px`,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <BridgeSVG height={BRIDGE_THICKNESS} />
            {bridgeEditable && (
              <>
                <div
                  onMouseDown={() => setDragging('left')}
                  style={{ position: 'absolute', left: -8, top: -6, width: 16, height: BRIDGE_THICKNESS + 12, cursor: 'ew-resize', pointerEvents: 'auto', background: 'transparent' }}
                  title="Drag to adjust bridge"
                />
                <div
                  onMouseDown={() => setDragging('right')}
                  style={{ position: 'absolute', right: -8, top: -6, width: 16, height: BRIDGE_THICKNESS + 12, cursor: 'ew-resize', pointerEvents: 'auto', background: 'transparent' }}
                  title="Drag to adjust bridge"
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Father Section */}
      <div ref={dadContainerRef} className="flex flex-col items-center" style={{ opacity: sonWalking ? 0.5 : 1, transition: 'opacity 0.6s', position: 'relative' }}>
        <svg ref={dadAvatarRef} viewBox="0 0 110 160" width="90" aria-label="Father avatar">
          <circle cx="55" cy="36" r="24" fill="#FFD7AF" />
          <ellipse cx="55" cy="26" rx="26" ry="13" fill="#4EB1C9" />
          <rect x="36" y="30" width="38" height="7" rx="3.5" fill="#3A94AB" />
          <circle cx="78" cy="38" r="5" fill="#FFD7AF" />
          <circle cx="49" cy="40" r="2" fill="#2A2A2A" />
          <circle cx="61" cy="40" r="2" fill="#2A2A2A" />
          <path d="M46,46 Q55,50 64,46" stroke="#A65C3A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="50" y="60" width="10" height="8" rx="4" fill="#FFD7AF" />
          <rect x="38" y="66" width="34" height="28" rx="10" fill="#4EB1C9" />
          <rect x="32" y="70" width="8" height="14" rx="4" fill="#FFD7AF" />
          <rect x="70" y="70" width="8" height="14" rx="4" fill="#FFD7AF" />
          <circle cx="36" cy="84" r="3" fill="#FFD7AF" />
          <circle cx="74" cy="84" r="3" fill="#FFD7AF" />
          <rect x="40" y="94" width="12" height="12" rx="3" fill="#51606F" />
          <rect x="58" y="94" width="12" height="12" rx="3" fill="#51606F" />
          <rect x="42" y="106" width="8" height="18" rx="3" fill="#FFD7AF" />
          <rect x="60" y="106" width="8" height="18" rx="3" fill="#FFD7AF" />
          <rect x="39" y="124" width="14" height="6" rx="3" fill="#2F2F2F" />
          <rect x="59" y="124" width="14" height="6" rx="3" fill="#2F2F2F" />
        </svg>
        {renderStack(fatherStackState, "bg-blue-500", fatherScrollRef, "Father", fatherTotal)}
        {/* Son stands with Father after walk completes (beside father's stack) */}
        {sonWalked && (
          <div style={{ position: 'absolute', left: '92px', bottom: `${finalSonBottom + FINAL_SON_STAND_DELTA}px`, pointerEvents: 'none' }}>
            <svg viewBox="0 0 100 135" width="56" aria-label="Son with Father">
              <circle cx="50" cy="32" r="18" fill="#FFD7AF" />
              <ellipse cx="50" cy="23" rx="22" ry="11" fill="#4EB1C9" />
              <rect x="36" y="26" width="28" height="6" rx="3" fill="#3A94AB" />
              <circle cx="66" cy="34" r="4" fill="#FFD7AF" />
              <circle cx="44" cy="36" r="1.7" fill="#2A2A2A" />
              <circle cx="56" cy="36" r="1.7" fill="#2A2A2A" />
              <path d="M42,41 Q50,45 58,41" stroke="#A65C3A" strokeWidth="2" fill="none" strokeLinecap="round" />
              <rect x="46" y="52" width="8" height="6" rx="3" fill="#FFD7AF" />
              <rect x="41" y="56" width="18" height="22" rx="8" fill="#4EB1C9" />
              <rect x="35" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
              <rect x="59" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
              <circle cx="38" cy="68" r="2.6" fill="#FFD7AF" />
              <circle cx="62" cy="68" r="2.6" fill="#FFD7AF" />
              <rect x="42" y="78" width="8" height="10" rx="3" fill="#51606F" />
              <rect x="50" y="78" width="8" height="10" rx="3" fill="#51606F" />
              <rect x="43" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
              <rect x="51" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
              <rect x="40" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
              <rect x="52" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
            </svg>
          </div>
        )}
        <button
          className="mt-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
          onClick={addFatherBlock}
          disabled={bridgeReady || sonWalking}
        >
          Add Father Block
        </button>
      </div>

      {/* Son Section */}
      <div className="flex flex-col items-center">
        {/* Hide son svg when walking */}
        <svg ref={sonAvatarRef} viewBox="0 0 100 135" width="70" aria-label="Son avatar"
          style={{ visibility: (sonWalking || sonWalked) ? 'hidden' : 'visible' }}
        >
          <circle cx="50" cy="32" r="18" fill="#FFD7AF" />
          <ellipse cx="50" cy="23" rx="22" ry="11" fill="#4EB1C9" />
          <rect x="36" y="26" width="28" height="6" rx="3" fill="#3A94AB" />
          <circle cx="66" cy="34" r="4" fill="#FFD7AF" />
          <circle cx="44" cy="36" r="1.7" fill="#2A2A2A" />
          <circle cx="56" cy="36" r="1.7" fill="#2A2A2A" />
          <path d="M42,41 Q50,45 58,41" stroke="#A65C3A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="46" y="52" width="8" height="6" rx="3" fill="#FFD7AF" />
          <rect x="41" y="56" width="18" height="22" rx="8" fill="#4EB1C9" />
          <rect x="35" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
          <rect x="59" y="58" width="6" height="10" rx="3" fill="#FFD7AF" />
          <circle cx="38" cy="68" r="2.6" fill="#FFD7AF" />
          <circle cx="62" cy="68" r="2.6" fill="#FFD7AF" />
          <rect x="42" y="78" width="8" height="10" rx="3" fill="#51606F" />
          <rect x="50" y="78" width="8" height="10" rx="3" fill="#51606F" />
          <rect x="43" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
          <rect x="51" y="88" width="6" height="14" rx="3" fill="#FFD7AF" />
          <rect x="40" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
          <rect x="52" y="102" width="10" height="5" rx="2.5" fill="#2F2F2F" />
        </svg>
        {renderStack(sonStackState, "bg-green-500", sonScrollRef, "Son", sonTotal)}
        <button
          className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
          onClick={addSonBlock}
          disabled={bridgeReady || sonWalking || sonWalked}
        >
          Add Son Block
        </button>
      </div>

      {/* Son walks on bridge, above stacks, when walk is triggered but not finished */}
      {sonWalking && (
        <SonWalking
          from={positions.leftSon}
          to={positions.leftDad}
          yOffset={bridgePos.bottom + BRIDGE_THICKNESS}
        />
      )}
      {/* Controls: Add Bridge at bottom-right, Walk at bottom-left, message centered */}
      <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
        <button
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow"
          disabled={sonWalking || sonWalked}
          onClick={handleAddBridge}
        >
          Add Bridge
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
        <button
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canWalk}
          onClick={() => {
            if (!canWalk) return;
            setBridgeEditable(false);
            setSonWalking(true);
            setTimeout(() => {
              setSonWalking(false);
              setShowBridge(false);
              setSonWalked(true);
            }, BRIDGE_ANIMATION_DURATION);
          }}
        >
          Walk Across
        </button>
      </div>
      {!!bridgeMessage && (
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)' }} className="text-red-600 font-semibold select-none">{bridgeMessage}</div>
      )}
      {/* Optionally on walk complete: can merge stacks, or show success UI */}
    </div>
  );
};

export default DadAndSonGame;