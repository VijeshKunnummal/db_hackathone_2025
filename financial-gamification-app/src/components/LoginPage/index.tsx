import "./login.css";
import { useNavigate } from "react-router-dom";
import { useScore } from "../../contexts/ScoreProvider";

const LoginPage = () => {
  const { setIsLogin } = useScore();
  const navigate = useNavigate();
  const onLogin = () => {
    localStorage.setItem("isLogin", "true");
    setIsLogin(true);
    navigate("/");
  };
  return (
    <div className="login">
      <button className="singpass" onClick={onLogin}>
        Singpass Login
      </button>
      <button className="guest" onClick={onLogin}>
        Login as Guest
      </button>
    </div>
  );
};

export default LoginPage;
