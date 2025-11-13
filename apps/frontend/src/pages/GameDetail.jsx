// src/pages/GameDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import gamesData from "../data/games";
import RatingStars from "../components/RatingStars";
import GamePlayer from "../components/GamePlayer";

export default function GameDetail() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const autoPlay = searchParams.get("autoPlay") === "true";

  const game = gamesData.find((g) => g.id.toString() === gameId.toString());

  const [startGame, setStartGame] = useState(autoPlay);

  // Auto scroll when autoplay happens
  useEffect(() => {
    if (autoPlay) {
      setTimeout(() => {
        window.scrollTo({ top: 300, behavior: "smooth" });
      }, 200);
    }
  }, [autoPlay]);

  if (!game) {
    return (
      <div style={{ padding: 20, color: "#fff" }}>
        <h2>Game Not Found</h2>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          Go Back
        </button>
      </div>
    );
  }

  // RELATED GAMES (same genre)
  const relatedGames = gamesData.filter(
    (g) => g.genre === game.genre && g.id !== game.id
  );

  return (
    <div style={styles.pageWrapper}>

      {/* BACK BUTTON */}
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      {/* TOP BANNER */}
      <div style={styles.bannerWrapper}>
        <img src={game.image} alt={game.title} style={styles.bannerImg} />

        {/* Glass info overlay */}
        <div style={styles.bannerContent}>
          <h1 style={styles.title}>{game.title}</h1>
          <p style={styles.genre}>{game.genre}</p>
          <RatingStars rating={game.rating} />

          {!startGame && (
            <button
              onClick={() => {
                setStartGame(true);
                setTimeout(() => {
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }, 200);
              }}
              style={styles.playBtn}
            >
              ▶ Play Now
            </button>
          )}
        </div>
      </div>

      {/* DESCRIPTION BOX */}
      <div style={styles.descriptionBox}>
        <h3 style={{ marginBottom: "10px" }}>About this game</h3>
        <p style={styles.description}>{game.description}</p>
      </div>

      {/* GAME PLAYER */}
      {startGame && (
        <div style={{ marginTop: 25 }}>
          <GamePlayer gameId={game.id} />
        </div>
      )}

      {/* RELATED GAMES */}
      {relatedGames.length > 0 && (
        <div style={styles.relatedSection}>
          <h3 style={styles.relatedTitle}>Related Games</h3>

          <div style={styles.relatedGrid}>
            {relatedGames.map((g) => (
              <div
                key={g.id}
                style={styles.relatedCard}
                onClick={() => navigate(`/game/${g.id}`)}
              >
                <img src={g.image} alt={g.title} style={styles.relatedImg} />
                <p style={styles.relatedName}>{g.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}


// -------------------- STYLES --------------------
const styles = {
  pageWrapper: {
    padding: "20px",
    color: "#fff",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  backBtn: {
    padding: "8px 12px",
    background: "#2563eb",
    borderRadius: 6,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "20px",
  },

  // Banner section
  bannerWrapper: {
    position: "relative",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "20px",
  },

  bannerImg: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    filter: "brightness(0.65)",
  },

  bannerContent: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    padding: "15px 18px",
    borderRadius: "12px",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
  },

  title: {
    fontSize: "32px",
    marginBottom: "4px",
  },

  genre: {
    color: "#93c5fd",
    marginBottom: "6px",
  },

  playBtn: {
    marginTop: "12px",
    padding: "10px 18px",
    background: "#10b981",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
  },

  // Description
  descriptionBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "18px",
    borderRadius: "10px",
    marginTop: "20px",
  },

  description: {
    color: "#cbd5e1",
    lineHeight: "1.7",
  },

  // Related games
  relatedSection: {
    marginTop: "35px",
  },

  relatedTitle: {
    fontSize: "20px",
    marginBottom: "15px",
  },

  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
  },

  relatedCard: {
    background: "#1e293b",
    borderRadius: "10px",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.2s",
  },

  relatedImg: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
  },

  relatedName: {
    padding: "10px",
    fontSize: "14px",
    color: "#e2e8f0",
    textAlign: "center",
  },
};
