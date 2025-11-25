import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";

const SideBar = ({ role, roleOptions }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="w-64 p-6 border-r border-slate-700/40 flex flex-col items-start gap-6">
      <div className="w-full flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">Signed in as</div>
          <div className="mt-1 text-lg font-semibold">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        </div>
      </div>

      <div className="w-full mt-2">
        <div className="text-xs uppercase text-slate-400 tracking-wider">
          Quick actions
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {roleOptions.map((q, i) => (
            <button
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

      <div className="mt-auto w-full">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-md"
        >
          <BiLogOutCircle size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      <div className="text-xs text-slate-500 mt-2">v1.0 • Restaurant POS</div>
    </div>
  );
};

export default SideBar;
