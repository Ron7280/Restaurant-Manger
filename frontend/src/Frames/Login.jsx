import { useContext, useMemo, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import Alert from "../Components/Alert";
import { Change_Theme_context } from "../Contexts";
import { IoIosLogIn } from "react-icons/io";
import { useAuth } from "../AuthContext";
import { GiMeal } from "react-icons/gi";
import { API } from "../API_URL";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);
  const [credentialsErr, setCredentialsErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changeTheme, setChangeTheme] = useContext(Change_Theme_context);
  const { notifyS, notifyE, notifyW, notifyI } = Alert({ changeTheme });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      notifyW("Please enter all credentials");
      setCredentialsErr(true);
      setPasswordErr(false);
      return;
    }
    if (password.length < 8) {
      notifyE("Password is too short");
      setPasswordErr(true);
      setCredentialsErr(false);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        notifyE(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("mobile", data.mobile);
      login(data.token);
      notifyS("Logged in successfully!");
    } catch (err) {
      notifyE("Failed to connect to server");
      console.error(err);
    }
  };

  const Fields = useMemo(
    () => [
      {
        id: 1,
        icon: FaUser,
        title: "Username",
        type: "text",
        placeholder: "Your username . . .",
        value: username,
        onchange: (e) => setUsername(e.target.value),
      },
      {
        id: 2,
        icon: RiLockPasswordFill,
        icon2: password ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white"
          >
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        ) : null,
        title: "Password",
        placeholder: "Your password . . .",
        type: showPassword ? "text" : "password",
        value: password,
        onchange: (e) => setPassword(e.target.value),
      },
    ],
    [username, password, showPassword]
  );

  return (
    <div className="bg-gray-900 p-5 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 shadow-black">
      <div className="text-3xl flex items-center justify-center gap-2 font-semibold text-white  mb-6">
        Bon Appetit
        <GiMeal size={40} />
      </div>
      <form
        className="flex flex-col space-y-5 font-semibold"
        onSubmit={handleSubmit}
      >
        {Fields.map((f, index) => {
          return (
            <div key={index} className="flex flex-col gap-1">
              <div className="text-gray-200 mb-1 flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 ${
                    passwordErr && f.id === 2 ? "text-[rgb(255,0,0)]" : ""
                  }`}
                >
                  <f.icon size={20} />
                  {f.title}
                </div>
                {f.icon2 ? f.icon2 : <></>}
              </div>
              <input
                type={f.type}
                className={`p-3 rounded-lg bg-white/20 text-white  placeholder-gray-300 border-2  outline-none
                    ${
                      passwordErr && f.id === 2
                        ? "border-[rgb(255,0,0)]"
                        : credentialsErr && !f.value
                        ? "border-[rgb(255,119,0)]"
                        : "border-white/30"
                    }`}
                placeholder={f.placeholder}
                value={f.value}
                onChange={f.onchange}
              />
            </div>
          );
        })}

        <div className="flex flex-col items-center justify-center gap-2">
          <button
            type="submit"
            className="bg-mainColor flex items-center gap-2 justify-center outline-none font-semibold 
            transition-all text-white py-3 w-full rounded-lg shadow-lg"
          >
            Login <IoIosLogIn size={25} />
          </button>
          <button
            onClick={() => navigate("/signUp")}
            className="text-mainColor w-full"
          >
            Create a new account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
