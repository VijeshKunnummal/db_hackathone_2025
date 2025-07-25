import { Toaster } from "react-hot-toast";
import { StyleSelector } from "./components/style/StyleSelector";
import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import GameTransition from "./components/common/GameTransition";
import Footer from "./components/common/Footer";
import { useScore } from "./contexts/ScoreProvider";

const LoginPage = React.lazy(() => import("./components/LoginPage"));
const HomePage = React.lazy(() => import("./components/HomePage"));
const TermMatchingGame = React.lazy(
  () => import("./components/games/TermMatchingGame"),
);
const LoanDiceGame = React.lazy(
  () => import("./components/games/loan-dice-game/LoanDiceGame"),
);
const LoanRoulette = React.lazy(
  () => import("./components/games/loan-roulette/LoanRoulette"),
);
const ChatUI = React.lazy(() => import("./components/chat/ChatUI"));

const Games = React.lazy(() => import("./components/games"));

const InnerApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin } = useScore();
  useEffect(() => {
    if (!isLogin && location.pathname !== "/login") {
      navigate("/login");
    } else if (isLogin && location.pathname === "/login") {
      navigate("/");
    }
  }, [isLogin, location.pathname]);
  return (
    <>
      <Toaster />
      <div className="app">
        <header className="app-header">
          <h1>
            FinLit<sup>+</sup>
            <div className="fire-glow">🔥</div>
          </h1>
          <StyleSelector />
          {/*<nav>*/}
          {/*  <ul>*/}
          {/*    <li><Link to="/">Home</Link></li>*/}
          {/*    <li><Link to="/term-matching">Matching</Link></li>*/}
          {/*    <li><Link to="/loan-dice">Dice</Link></li>*/}
          {/*    <li><Link to="/loan-roulette">Roulette</Link></li>*/}
          {/*    <li><Link to="/chat-assistant">Chat Assistant</Link></li>*/}
          {/*  </ul>*/}
          {/*</nav>*/}
        </header>

        <main className="app-content">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<HomePage />} />
              <Route
                path="/games"
                element={
                  <GameTransition>
                    <Games />
                  </GameTransition>
                }
              >
                <Route
                  index
                  element={
                    <GameTransition>
                      <LoanRoulette />
                    </GameTransition>
                  }
                />
                <Route
                  path="loan-dice"
                  element={
                    <GameTransition>
                      <LoanDiceGame />
                    </GameTransition>
                  }
                />
                <Route
                  path="term-matching"
                  element={
                    <GameTransition>
                      <TermMatchingGame />
                    </GameTransition>
                  }
                />
              </Route>
              <Route
                path="/chat-assistant"
                element={
                  <GameTransition>
                    <ChatUI />
                  </GameTransition>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default InnerApp;
