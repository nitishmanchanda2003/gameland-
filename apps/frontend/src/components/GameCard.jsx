// src/components/GameCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";

export default function GameCard({ game, onPlay }) {
  const navigate = useNavigate();

  // ⭐ Backend thumbnail fix
  const imageSrc = game.thumbnail?.startsWith("/uploads")
    ? `http://localhost:5000${game.thumbnail}`
    : game.thumbnail || game.image || "/fallback.png";

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/game/${game.slug}`)} // ⭐ navigate by slug
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.5)";
        e.currentTarget.style.background =
          "linear-gradient(145deg, #1e293b, #28334d)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
        e.currentTarget.style.background = "#1e293b";
      }}
    >
      <img src={imageSrc} alt={game.title} style={styles.image} />

      <div style={styles.info}>
        <h3 style={styles.title}>{game.title}</h3>
        <p style={styles.genre}>{game.genre}</p>

        <RatingStars rating={game.rating || 4.3} />

        <button
          style={styles.playButton}
          onClick={(e) => {
            e.stopPropagation();   // stop card click
            onPlay(game);          // ⭐ open modal with game object
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Play Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    borderRadius: 12,
    overflow: "hidden",
    width: 220,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: 140,
    objectFit: "cover",
  },
  info: {
    padding: "12px",
  },
  title: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  genre: {
    fontSize: 13,
    color: "#a5b4fc",
    marginBottom: 6,
  },
  playButton: {
    width: "100%",
    padding: "8px",
    background: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: "8px",
    fontWeight: 500,
    transition: "background 0.3s, transform 0.2s",
  },
};
