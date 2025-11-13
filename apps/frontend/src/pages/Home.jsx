// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import gamesData from "../data/games";
import GameCard from "../components/GameCard";
import GameModal from "../components/GameModal";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);

  const trending = [...gamesData].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const popular = gamesData.filter((g) => g.rating >= 4.3);
  const newReleases = [...gamesData].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <div style={styles.wrapper}>

      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0px)" : "translateY(20px)",
        }}
      >
        <div style={styles.heroGlow}></div>
        <h1 style={styles.heroTitle}>Welcome to Gameland 🎮</h1>
        <p style={styles.heroSub}>Play games instantly — no downloads needed!</p>
      </section>

      {/* TRENDING */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🔥 Trending Games</h2>

        <div style={styles.horizontalScroll}>
          {trending.map((game, i) => (
            <div
              key={game.id}
              style={{
                ...styles.horizontalItem,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(25px)",
                transition: `all .6s ease ${i * 0.12}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>⭐ Popular Games</h2>

        <div style={styles.grid}>
          {popular.map((game, i) => (
            <div
              key={game.id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0.95)",
                transition: `all .55s ease ${i * 0.08}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      {/* NEW RELEASES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🆕 New Releases</h2>

        <div style={styles.grid}>
          {newReleases.map((game, i) => (
            <div
              key={game.id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transition: `all .6s ease ${i * 0.1}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

//
// ------------ STYLES 100% FIXED ----------------
//
const styles = {
  wrapper: {
    padding: "20px",
    color: "#fff",
    maxWidth: "1300px",
    margin: "0 auto",
  },

  /* HERO */
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "55px 20px",
    marginBottom: "50px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    boxShadow: "0 0 30px rgba(0,0,0,0.45)",
    overflow: "hidden",
    transition: "all .6s ease",
  },

  heroGlow: {
    position: "absolute",
    top: "-40%",
    left: "-30%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)",
    filter: "blur(100px)",
  },

  heroTitle: {
    fontSize: "38px",
    fontWeight: 800,
    marginBottom: "8px",
  },

  heroSub: {
    fontSize: "17px",
    color: "#9ca3af",
  },

  /* SECTION */
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "16px",
  },

  /* FIXED HORIZONTAL ROW */
  horizontalScroll: {
    display: "flex",
    gap: "18px",
    overflowX: "auto",
    paddingBottom: "10px",
    scrollBehavior: "smooth",
  },

  horizontalItem: {
    minWidth: "230px",
    display: "flex",
    justifyContent: "center",
  },

  /* 🔥 FIXED GRID — NO OVERLAP EVER */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "22px",
    justifyItems: "center",
  },
};
