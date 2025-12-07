import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { FaCircleUser } from "react-icons/fa6";

const SideBar = ({ roleOptions }) => {
  const User_role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-[15%] p-2 border-r bg-transparent border-white flex flex-col items-start gap-1">
      <div className="w-full pb-1 h-[5%] border-b flex items-center justify-between">
        <div className="flex flex-col w-full justify-between text-white">
          <div className="flex w-full font-semibold gap-5 justify-between">
            <div className="w-[50%] flex items-center gap-1">
              <div className="flex w-[50%] pl-3 items-center gap-1 text-lg">
                <FaCircleUser size={25} />
              </div>
              <div className="w-[50%]">{username}</div>
            </div>
            <div className="w-[50%] flex items-center justify-between gap-4">
              <div className="w-[50%] text-mainColor first-letter:uppercase ">
                {User_role}
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center 
              rounded-lg hover:bg-Red text-white transition shadow-md"
              >
                <BiLogOutCircle size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[95%]">
        <div
          className="scroll-left  flex flex-col gap-2 overflow-y-auto h-full scrollbar-thin
       scrollbar-thumb-mainColor scrollbar-track-transparent "
        >
          {roleOptions.map((q, i) => (
            <button
              dir="ltr"
              key={i}
              onClick={() => navigate(q.nav)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/6 hover:bg-white/10 transition flex items-center gap-3"
            >
              <div className="bg-gradient-to-tr from-mainColor to-Indigo p-2 rounded-lg ">
                {q.icon}
              </div>
              <div>
                <div className="text-sm font-medium">{q.text1}</div>
                <div className="text-xs text-slate-400">{q.text2}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
