import { createContext, useContext } from "react";

export const ScoreContext = createContext({
  score: 0,
  setScore: (newScore: number) => {},
  isLogin: !localStorage.getItem("isLogin")
    ? false
    : localStorage.getItem("isLogin") === "true",
  setIsLogin: (isLogin: boolean) => {},
});

export const useScore = () => {
  return useContext(ScoreContext);
};
