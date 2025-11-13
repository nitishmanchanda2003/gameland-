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
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getTestData();
  //       if (data) setMessage(data.message);
  //     } catch (error) {
  //       console.error("Backend Error:", error);
  //       setMessage("Failed to connect to backend.");
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <div style={styles.appWrapper}>
      <Navbar />

      <main style={styles.container}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* <h1 style={styles.title}>Welcome to Gameland 🎮</h1>
                <p style={styles.message}>
                  {message || "Loading backend connection..."}
                </p> */}

                <Home />
              </>
            }
          />

          <Route path="/categories" element={<Categories />} />

          <Route path="/game/:gameId" element={<GameDetail />} />
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
    width: "100vw",        // ensure full viewport width
    overflowX: "hidden",   // prevent horizontal overflow
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
