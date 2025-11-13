// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import GameDetail from "./pages/GameDetail";
import Login from "./pages/Login";        // ⭐ NEW
import Register from "./pages/Register";  // ⭐ NEW

function App() {
  return (
    <div style={styles.appWrapper}>
      <Navbar />

      <main style={styles.container}>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* CATEGORIES */}
          <Route path="/categories" element={<Categories />} />

          {/* GAME DETAILS */}
          <Route path="/game/:gameId" element={<GameDetail />} />

          {/* AUTH PAGES */}
          <Route path="/login" element={<Login />} />         {/* ⭐ */}
          <Route path="/register" element={<Register />} />   {/* ⭐ */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  appWrapper: {
    background: "#0f172a",
    minHeight: "100vh",
    width: "100vw",
    overflowX: "hidden",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
    flex: 1,
  },
};

export default App;
