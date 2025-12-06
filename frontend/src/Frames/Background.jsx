import React from "react";
import { Outlet } from "react-router-dom";

const Background = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700">
      <Outlet />
    </div>
  );
};

export default Background;
