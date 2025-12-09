import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const MainDashboard = () => {
  const { role, roleOptions } = useOutletContext();

  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-5 p-10">
      <div className="flex items-center gap-1">
        <img src="src/assets/restaurant.png" className="w-16 h-16" />
        <div>
          <div
            className="text-3xl font-extrabold
          bg-gradient-to-r from-mainColor to-Indigo bg-clip-text text-transparent"
          >
            Welcome back
          </div>
          <p className="text-gray-400 mt-1">Choose an action to get started</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleOptions.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => navigate(opt.nav)}
            className="relative flex items-center gap-6 p-6 rounded-2xl bg-gray-900
             backdrop-blur-sm border border-gray-600 hover:shadow-2xl hover:-translate-y-2 
             transform transition cursor-pointer"
          >
            <div
              className="w-1 h-full rounded-l-lg"
              style={{
                background: `linear-gradient(180deg,#06b6d4,#8b5cf6)`,
              }}
            />

            <div
              className="flex items-center justify-center w-16 h-16 rounded-xl 
            bg-gradient-to-br from-mainColor2 via-mainColor2 to-mainColor shadow-inner"
            >
              <div className="text-white">{opt.icon}</div>
            </div>

            <div className="flex-1">
              <div className="text-lg font-semibold text-white">
                {opt.text1}
              </div>
              <div className="text-sm text-slate-300 mt-1">{opt.text2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
