import { createContext, useContext } from "react";

export const ScoreContext = createContext({
  score: 0,
  setScore: (newScore: number) => {},
});

export const useScore = () => {
  return useContext(ScoreContext);
};
