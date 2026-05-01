import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieListDetail from "./MovieListDetail";

const Landingpage = () => {
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
  const savedUser = localStorage.getItem("user");
  try {
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  } catch (e) {
    console.error("Error parsing user from storage", e);
    setUser(null);
  }
};


    // 2. Run check immediately on load
    checkAuth();

    // 3. Listen for storage changes (handles logins/logouts across tabs)
    window.addEventListener("storage", checkAuth);

    const timer = setTimeout(() => {
      setDone(true);
    }, 3000);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearTimeout(timer);
    };
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/movies?search=${search}`);
  };

  const handleStart = () => {
    setStarted(true);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null); // Instantly updates UI
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">

      {/* 🎥 BACKGROUND */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-700"
        style={{
          filter: started ? "blur(0px)" : "blur(16px)",
          transform: started ? "scale(1)" : "scale(1.06)",
          opacity: 1,
        }}
      >
        <MovieListDetail embedded={true} />
      </div>

      {/* 🌑 OVERLAY */}
      <div
        className="absolute inset-0 w-full h-full bg-black transition-opacity duration-700"
        style={{
          opacity: started ? 0 : 0.65,
          pointerEvents: started ? "none" : "auto",
        }}
      />

      {/* 🎬 UI */}
      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-6 transition-all duration-700"
        style={{
          opacity: started ? 0 : 1,
          transform: started ? "translateY(-20px)" : "translateY(0px)",
          pointerEvents: started ? "none" : "auto",
        }}
      >

        {/* LOGO */}
        <div className="w-[800px]">
          <img
            src={done ? "/FALOGONO2.png" : "/FALOGONO.GIF"}
            alt="logo"
            className="w-full object-contain"
          />
        </div>

        {/* 🔥 START BUTTON */}
        <button
          onClick={handleStart}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full font-semibold transition"
        >
          Start
        </button>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 w-[600px] bg-black/60 border border-white/20 rounded-full px-4 py-2 backdrop-blur-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search films..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            onClick={handleSearch}
            className="text-sm px-4 py-1 bg-red-600 hover:bg-red-700 rounded-full transition"
          >
            Search
          </button>
        </div>

        {/* AUTH BUTTONS SECTION */}
       {/* AUTH BUTTONS SECTION */}
<div className="flex gap-4 items-center">
  {user ? (
    <>
      {/* Check if user.username exists specifically */}
      <span className="text-gray-300 font-medium">
        Hi, {user.username || 'Member'}!
      </span>
      <button
        onClick={handleLogout}
        className="px-5 py-2 border border-red-600 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <button onClick={() => navigate("/signup")} className="px-5 py-2 border border-white/40 rounded-full hover:bg-white hover:text-black transition">
        Sign Up
      </button>
      <button onClick={() => navigate("/login")} className="px-5 py-2 border border-white/40 rounded-full hover:bg-white hover:text-black transition">
        Login
      </button>
    </>
  )}
</div>

      </div>
    </div>
  );
};

export default Landingpage;
