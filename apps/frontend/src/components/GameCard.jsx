// src/components/GameCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { increasePlay } from "../services/gameActions";

export default function GameCard({ game, onPlay }) {
  const navigate = useNavigate();

  // ⭐ Backend thumbnail fix
  const imageSrc = game.thumbnail?.startsWith("/uploads")
    ? `http://localhost:5000${game.thumbnail}`
    : game.thumbnail || game.image || "/fallback.png";

  // ⭐ Prevent spam clicks (cooldown)
  const canPlay = () => {
    const last = localStorage.getItem(`play_${game._id}`);
    if (!last) return true;

    const diff = Date.now() - Number(last);
    return diff > 3000; // 3 seconds cooldown
  };

  // ⭐ Handle Play Button Click
  const handlePlayClick = async (e) => {
    e.stopPropagation();

    if (canPlay() === false) {
      console.log("Play spam blocked");
      return;
    }

    try {
      await increasePlay(game._id); // backend +1

      // save cooldown
      localStorage.setItem(`play_${game._id}`, Date.now().toString());

      if (onPlay) onPlay(game); // open modal
    } catch (err) {
      console.log("Play count update failed:", err);
    }
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/game/${game.slug}`)}
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

        {/* ⭐ Read-only Rating */}
        <RatingStars rating={game.rating || 4.0} size={18} readOnly={true} />

        <button
          style={styles.playButton}
          onClick={handlePlayClick}
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
