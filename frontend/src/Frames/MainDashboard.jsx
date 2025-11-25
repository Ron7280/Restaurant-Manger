import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const MainDashboard = () => {
  const { role, roleOptions } = useOutletContext();

  const navigate = useNavigate();
  return (
    <div className="flex-1 p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-300 mt-1">Choose an action to get started</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-2 rounded-lg bg-white/6 text-sm">
            Role: <div className="font-medium ml-2">{role}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white/6 text-sm">
            Live:{" "}
            <div className="font-medium ml-2 text-emerald-300">Online</div>
          </div>
        </div>
      </div>

      {/* Cards area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roleOptions.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => navigate(opt.nav)}
            className="relative flex items-center gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm ring-1 ring-white/6 hover:shadow-2xl hover:-translate-y-2 transform transition cursor-pointer"
          >
            {/* vertical accent bar */}
            <div
              className="w-1 h-full rounded-l-lg"
              style={{
                background: `linear-gradient(180deg,#06b6d4,#8b5cf6)`,
              }}
            />

            {/* icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-white/6 to-white/3 shadow-inner">
              <div className="text-amber-300">{opt.icon}</div>
            </div>

            {/* text */}
            <div className="flex-1">
              <div className="text-lg font-semibold text-white">
                {opt.text1}
              </div>
              <div className="text-sm text-slate-300 mt-1">{opt.text2}</div>

              {/* subtle meta row */}
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                <div className="px-2 py-1 bg-white/3 rounded-full">Quick</div>
                <div className="px-2 py-1 bg-white/3 rounded-full">
                  Tap to open
                </div>
              </div>
            </div>

            {/* chevron */}
            <div className="opacity-60">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
