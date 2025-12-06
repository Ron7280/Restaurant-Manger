import { useContext, useMemo, useState } from "react";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { BsTelephoneFill } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import Alert from "../Components/Alert";
import { Change_Theme_context } from "../Contexts";
import { API } from "../API_URL";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  const [changeTheme] = useContext(Change_Theme_context);
  const { notifyS, notifyE, notifyW } = Alert({ changeTheme });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let err = {};

    if (!fname || !lname || !username || !mobile || !password || !confirm) {
      notifyW("Please fill all fields");
      err.global = true;
    }

    if (password.length < 8) {
      notifyE("Password must be at least 8 characters");
      err.password = true;
    }

    if (password !== confirm) {
      notifyE("Passwords do not match");
      err.confirm = true;
    }

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          lname,
          username,
          mobile,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        notifyE(data.error || "Signup failed");
        return;
      }

      notifyS("Account created successfully!");
    } catch (error) {
      console.error(error);
      notifyE("Failed to connect to server");
    }
  };

  const Fields = useMemo(
    () => [
      {
        id: 1,
        title: "First Name",
        icon: FaUser,
        type: "text",
        placeholder: "Your first name . . .",
        value: fname,
        onchange: (e) => setFname(e.target.value),
      },
      {
        id: 2,
        title: "Last Name",
        icon: FaUser,
        type: "text",
        placeholder: "Your last name . . .",
        value: lname,
        onchange: (e) => setLname(e.target.value),
      },
      {
        id: 3,
        title: "Username",
        icon: FaUser,
        type: "text",
        placeholder: "Choose a username . . .",
        value: username,
        onchange: (e) => setUsername(e.target.value),
      },
      {
        id: 4,
        title: "Mobile Number",
        icon: BsTelephoneFill,
        type: "tel",
        placeholder: "Your mobile number . . .",
        value: mobile,
        onchange: (e) => setMobile(e.target.value),
      },
      {
        id: 5,
        title: "Password",
        icon: RiLockPasswordFill,
        icon2: password ? (
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        ) : null,
        type: showPassword ? "text" : "password",
        placeholder: "Create a password . . .",
        value: password,
        onchange: (e) => setPassword(e.target.value),
      },
      {
        id: 6,
        title: "Confirm Password",
        icon: RiLockPasswordFill,
        icon2: confirm ? (
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        ) : null,
        type: showConfirm ? "text" : "password",
        placeholder: "Confirm your password . . .",
        value: confirm,
        onchange: (e) => setConfirm(e.target.value),
      },
    ],
    [
      fname,
      lname,
      username,
      mobile,
      password,
      confirm,
      showPassword,
      showConfirm,
    ]
  );

  return (
    <div
      className="bg-gray-900 p-5 rounded-2xl shadow-2xl 
    w-full max-w-lg border border-white/20 shadow-black"
    >
      <div className="text-3xl flex items-center justify-center gap-2 font-semibold text-white mb-6">
        Create Account
        <GiMeal size={40} />
      </div>

      <form
        className="flex flex-col space-y-5 font-semibold"
        onSubmit={handleSubmit}
      >
        {Fields.map((f) => (
          <div key={f.id} className="flex flex-col gap-1">
            <div className="text-gray-200 mb-1 flex justify-between">
              <div
                className={`flex gap-2 items-center ${
                  errors.password && f.id === 5 ? "text-red-500" : ""
                } ${errors.confirm && f.id === 6 ? "text-red-500" : ""}`}
              >
                <f.icon size={20} />
                {f.title}
              </div>

              {f.icon2 ? f.icon2 : null}
            </div>

            <input
              type={f.type}
              placeholder={f.placeholder}
              value={f.value}
              onChange={f.onchange}
              className={`p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border-2 outline-none
                ${
                  errors.password && f.id === 5
                    ? "border-red-500"
                    : errors.confirm && f.id === 6
                    ? "border-red-500"
                    : errors.global && !f.value
                    ? "border-orange-500"
                    : "border-white/30"
                }`}
            />
          </div>
        ))}

        <div className="flex flex-col items-center justify-center gap-2">
          <button
            type="submit"
            className="bg-mainColor flex items-center gap-2
             justify-center text-white py-3 rounded-lg shadow-lg
              font-semibold w-full"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-mainColor w-full"
          >
            i have an account
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
