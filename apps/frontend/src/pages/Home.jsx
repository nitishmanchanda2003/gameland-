// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";
import GameModal from "../components/GameModal";

export default function Home() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await getAllGames();
        setGames(res.data.games);
      } catch (e) {
        console.log("Failed to load games:", e);
      }
    }
    loadGames();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  // -------------------------------
  // ⭐ TRENDING (industry formula)
  // -------------------------------
  const trending = [...games]
    .map((g) => ({
      ...g,
      trendScore: g.playCount + g.rating * 20,
    }))
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 7);

  // -------------------------------
  // ⭐ POPULAR (all-time hits)
  // -------------------------------
  const popular = [...games].sort((a, b) => b.playCount - a.playCount);

  // -------------------------------
  // ⭐ NEW RELEASES
  // -------------------------------
  const newReleases = [...games].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div style={styles.wrapper}>
      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(25px)",
        }}
      >
        <div style={styles.heroGlow} />
        <h1 style={styles.heroTitle}>Welcome to Gameland 🎮</h1>
        <p style={styles.heroSub}>Play amazing online games — fully free!</p>
      </section>

      <div style={styles.sectionDivider}></div>

      {/* 🔥 TRENDING */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>🔥 Trending Games</h2>

        <div style={styles.horizontalScroll}>
          {trending.map((game, i) => (
            <div
              key={game._id}
              style={{
                ...styles.horizontalItem,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(20px)",
                transition: `all .6s ease ${i * 0.1}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ POPULAR */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>⭐ Popular Games</h2>

        <div style={styles.grid}>
          {popular.map((game, i) => (
            <div
              key={game._id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0.92)",
                transition: `all .55s ease ${i * 0.07}s`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>
      </section>

      {/* 🆕 NEW RELEASES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleGlow}>🆕 New Releases</h2>

        <div style={styles.grid}>
          {newReleases.map((game, i) => (
            <div
              key={game._id}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(25px)",
                transition: `all .6s ease ${i * 0.09}s`,
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

const styles = {
  wrapper: {
    padding: "20px",
    color: "#fff",
    maxWidth: "1350px",
    margin: "0 auto",
  },
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "20px",
    marginBottom: "60px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  },
  heroGlow: {
    position: "absolute",
    top: "-45%",
    left: "-35%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(96,165,250,0.17), transparent 70%)",
    filter: "blur(120px)",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: 800,
    marginBottom: "10px",
  },
  heroSub: {
    fontSize: "18px",
    color: "#9ca3af",
  },
  sectionDivider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
    margin: "20px 0 30px",
    opacity: 0.6,
  },
  section: { marginBottom: "50px" },
  sectionTitleGlow: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "18px",
    textShadow: "0 0 12px rgba(59,130,246,0.55)",
  },
  horizontalScroll: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "10px",
  },
  horizontalItem: {
    minWidth: "230px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "24px",
  },
};
