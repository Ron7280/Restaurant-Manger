import React from "react";
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
      <div className="w-full h-[5%]flex items-center justify-between">
        <div className="flex flex-col w-full justify-between text-slate-300">
          <div className="flex w-full justify-between">
            <div className="flex w-full items-center gap-1 text-lg">
              <FaCircleUser /> {username}
            </div>
            <button
              onClick={logout}
              className="w-[15%] flex items-center gap-3 h-[4%] justify-center rounded-lg bg-Red text-white transition shadow-md"
            >
              <BiLogOutCircle size={20} />
            </button>
          </div>
          <div className="w-full text-mainColor ">{User_role}</div>
        </div>
      </div>

      <div className="w-full h-[95%]">
        <div className="uppercase text-slate-400 tracking-wider">
          Quick access
        </div>
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
              <div className="p-2 bg-white/8 rounded-md">{q.icon}</div>
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
