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
      <button
        className="fb rounded-md block border-2 border-[#2d64f6]  bg-[#2d64f6] text-white text-center px-4 py-2 my-4 mx-auto cursor-pointer text-sm transition-all duration-300 hover:bg-[#2450c4] hover:border-[#2450c4]"
        onClick={onLogin}
      >
        Facebook Login
      </button>
      <button
        className="singpass rounded-md block border-2 border-[#e14645] bg-[#e14645] text-white text-center px-4 py-2 my-4 mx-auto cursor-pointer text-sm transition-all duration-300 hover:bg-[#b43837] hover:border-[#b43837]"
        onClick={onLogin}
      >
        Singpass Login
      </button>
      <button
        className="guest rounded-md block border-2 text-gray-800 text-center px-4 py-2 my-4 mx-auto cursor-pointer text-sm transition-all duration-300 hover:bg-gray-800 hover:text-white hover:border-gray-800"
        onClick={onLogin}
      >
        Login as Guest
      </button>
    </div>
  );
};

export default LoginPage;
