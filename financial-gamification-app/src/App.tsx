import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { StyleProvider } from "./contexts/StyleContext";
import { ChatProvider } from "./contexts/ChatContext";
import "./App.css";
import { ScoreContext } from "./contexts/ScoreProvider";
import InnerApp from "./InnerApp";

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [isLogin, setIsLogin] = useState(
    !localStorage.getItem("isLogin")
      ? false
      : localStorage.getItem("isLogin") === "true",
  );
  return (
    <Router>
      <StyleProvider>
        <AccessibilityProvider>
          <ChatProvider>
            <ScoreContext.Provider
              value={{ score, setScore, isLogin, setIsLogin }}
            >
              <InnerApp />
            </ScoreContext.Provider>
          </ChatProvider>
        </AccessibilityProvider>
      </StyleProvider>
    </Router>
  );
};

export default App;
