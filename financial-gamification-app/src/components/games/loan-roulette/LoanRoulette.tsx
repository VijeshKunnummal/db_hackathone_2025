import classnames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { loanQuestions } from "../../../data/loanQuestions";
import "./LoanRoulette.css";
import SpinWheel from "./SpinWheel";
import toast from "react-hot-toast";

const SEGMENTS = loanQuestions.map((q) => q.id);
const LoanRoulette: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const questions = useMemo(() => [...loanQuestions], []);
  const currentQuestion =
    selectedNumber !== null ? questions[selectedNumber] : null;

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setAnsweredCorrectly(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + currentQuestion.points);
    }
  };

  const spinRoulette = () => {
    if (spinning) return;

    setSpinning(true);

    setSelectedNumber(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnsweredCorrectly(false);
  };
  const onSpinEnd = (result: number) => {
    setIsAnimating(false);
    setSelectedNumber(result);
    setScore((prev) => prev + result * 10);
    setSpinning(false);
  };
  useEffect(() => {
    if (score >= 400) {
      toast("🎉 Milestone reached! Turn your point to credit now!");
    }
  }, [score]);

  return (
    <div className="loan-roulette">
      <div className="game-header">
        <h2>Lucky Number Roulette</h2>
        <div className="score">Score: {score}</div>
      </div>
      <SpinWheel
        isSpinning={spinning}
        onSpinEnd={onSpinEnd}
        segments={SEGMENTS}
        selectedNumber={selectedNumber}
      />

      {currentQuestion && !spinning && (
        <div className="question-container">
          <h3 className="question">{currentQuestion.question}</h3>

          <div className="answers-grid">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                className={`answer-button ${
                  selectedAnswer === index
                    ? answeredCorrectly
                      ? "correct"
                      : "incorrect"
                    : ""
                } ${selectedAnswer !== null ? "disabled" : ""} ${
                  showResult && currentQuestion.correctAnswer === index
                    ? "show-correct"
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </button>
            ))}
          </div>

          {showResult && (
            <div
              className={`answer-result ${answeredCorrectly ? "correct" : "incorrect"}`}
            >
              <h4>{answeredCorrectly ? "Correct!" : "Incorrect!"}</h4>
              {answeredCorrectly && (
                <div className="points">+{currentQuestion.points} points</div>
              )}
              <p className="explanation">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      <button
        className={classnames("spin-button", {
          disabled: spinning || (currentQuestion && !showResult),
        })}
        onClick={spinRoulette}
        disabled={spinning || isAnimating}
      >
        {spinning
          ? "Spinning..."
          : showResult
            ? "Next Question"
            : "Spin the Wheel"}
      </button>
    </div>
  );
};

export default LoanRoulette;
