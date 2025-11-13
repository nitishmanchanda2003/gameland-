// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import GameDetail from "./pages/GameDetail";

// Backend API
import { getTestData } from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTestData();
        if (data) setMessage(data.message);
      } catch (error) {
        console.error("Backend Error:", error);
        setMessage("Failed to connect to backend.");
      }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.appWrapper}>
      <Navbar />

      <div style={styles.container}>
        {/* Backend Connection Message - Only on Home */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 style={styles.title}>Welcome to Gameland 🎮</h1>
                <p style={styles.message}>
                  {message || "Loading backend connection..."}
                </p>

                <Home />
              </>
            }
          />

          <Route path="/categories" element={<Categories />} />

          <Route path="/game/:gameId" element={<GameDetail />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  appWrapper: {
    background: "#0f172a",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    margin: "10px 0 5px",
  },
  message: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "30px",
  },
};

export default App;
