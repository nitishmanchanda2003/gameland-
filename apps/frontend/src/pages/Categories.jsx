// src/pages/Categories.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import gamesData from "../data/games";
import GameCard from "../components/GameCard";
import SearchBar from "../components/SearchBar";
import GameModal from "../components/GameModal";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGame, setSelectedGame] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const initialGenre = searchParams.get("genre") || "All";

  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState(initialGenre);
  const [sortOrder, setSortOrder] = useState("desc");

  const genres = useMemo(
    () => ["All", ...new Set(gamesData.map((g) => g.genre))],
    []
  );

  const filteredGames = useMemo(() => {
    let list = gamesData.filter((g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (genreFilter !== "All") {
      list = list.filter((g) => g.genre === genreFilter);
    }

    list.sort((a, b) =>
      sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
    );

    return list;
  }, [searchTerm, genreFilter, sortOrder]);

  const handleGenreSelect = (genre) => {
    setGenreFilter(genre);

    if (genre === "All") setSearchParams({});
    else setSearchParams({ genre });
  };

  return (
    <div
      style={{
        ...styles.wrapper,
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <style>
        {`
          @keyframes fadePop {
            0% { opacity:0; transform: translateY(12px) scale(0.95); }
            100% { opacity:1; transform: translateY(0) scale(1); }
          }
        `}
      </style>

      {/* TITLE */}
      <h1 style={styles.heading}>Browse Games by Category</h1>
      <p style={styles.subText}>Explore by genres & discover new games 🎮</p>

      {/* SEARCH + SELECTS */}
      <div style={styles.topBar}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div style={styles.selectArea}>
          <select
            value={genreFilter}
            onChange={(e) => handleGenreSelect(e.target.value)}
            style={styles.select}
          >
            {genres.map((genre) => (
              <option value={genre} key={genre} style={styles.option}>
                {genre}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.select}
          >
            <option value="desc" style={styles.option}>
              Rating: High → Low
            </option>
            <option value="asc" style={styles.option}>
              Rating: Low → High
            </option>
          </select>
        </div>
      </div>

      {/* CHIPS */}
      <div style={styles.chipContainer}>
        {genres.map((genre, i) => (
          <button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            style={{
              ...styles.chip,
              ...(genre === genreFilter ? styles.chipActive : {}),
              animation: `fadePop 0.35s ease ${(i * 0.05).toFixed(2)}s both`,
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* GAME GRID */}
      <div style={styles.grid}>
        {filteredGames.length ? (
          filteredGames.map((game, i) => (
            <div
              key={game.id}
              style={{
                animation: `fadePop 0.45s ease ${(i * 0.07).toFixed(2)}s both`,
              }}
            >
              <GameCard game={game} onPlay={() => setSelectedGame(game)} />
            </div>
          ))
        ) : (
          <div style={styles.noResult}>
            <h2>No games found 😢</h2>
            <p style={{ marginTop: 6, color: "#64748b" }}>
              Try searching something else.
            </p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

//
// -------------- PREMIUM STYLES ------------------
//
const styles = {
  wrapper: {
    padding: "20px",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
    transition: "all 0.5s ease",
  },

  heading: {
    marginBottom: "5px",
    fontSize: "32px",
    fontWeight: 700,
    background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  subText: {
    marginBottom: "20px",
    color: "#94a3b8",
    fontSize: "15px",
  },

  topBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
    animation: "fadePop 0.4s ease both",
  },

  selectArea: {
    display: "flex",
    gap: "12px",
    marginLeft: "auto",
  },

  select: {
    padding: "10px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.2s",
    backdropFilter: "blur(6px)",
  },

  option: {
    background: "#1e293b",
    color: "#e2e8f0",
  },

  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "25px",
    paddingTop: "5px",
  },

  chip: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.25s ease",
  },

  chipActive: {
    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 6px 20px rgba(124,58,237,0.35)",
    transform: "translateY(-2px) scale(1.03)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "22px",
    justifyItems: "center",
  },

  noResult: {
    gridColumn: "1/-1",
    textAlign: "center",
    marginTop: "40px",
    opacity: 0.9,
  },
};
