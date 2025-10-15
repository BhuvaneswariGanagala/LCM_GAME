import React, { useState } from "react";
import LCMVisualizer from "./pages/LCMVisualizer";
import Home from "./components/Home";

function App() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <Home onEnter={() => setEntered(true)} />;
  }

  return <LCMVisualizer />;
}

export default App;
