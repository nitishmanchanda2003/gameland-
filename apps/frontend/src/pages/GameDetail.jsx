// src/pages/GameDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getAllGames } from "../services/api";
import RatingStars from "../components/RatingStars";
import GamePlayer from "../components/GamePlayer";

export default function GameDetail() {
  const { slug } = useParams(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoPlay = searchParams.get("autoPlay") === "true";

  const [game, setGame] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [startGame, setStartGame] = useState(autoPlay);
  const [animate, setAnimate] = useState(false);

  // ------------------------------------------------------
  // FETCH ALL GAMES + FIND CURRENT BY SLUG
  // ------------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const res = await getAllGames();
        const list = res.data.games;
        setAllGames(list);

        const g = list.find((x) => x.slug === slug);
        setGame(g);
      } catch (err) {
        console.log("Fetch failed:", err);
      }
    }
    loadData();
  }, [slug]);

  // Page Animation
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  // Auto Scroll
  useEffect(() => {
    if (autoPlay) {
      setTimeout(() => {
        window.scrollTo({ top: 330, behavior: "smooth" });
      }, 250);
    }
  }, [autoPlay]);

  // ------------------------------------------------------
  // GAME NOT FOUND
  // ------------------------------------------------------
  if (!game) {
    return (
      <div style={{ padding: 20, color: "#fff" }}>
        <h2>Game Not Found</h2>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>Go Back</button>
      </div>
    );
  }

  // Image URL fix
  const bannerImg = game.thumbnail?.startsWith("/uploads")
    ? `http://localhost:5000${game.thumbnail}`
    : game.thumbnail;

  // Related games
  const related = allGames.filter(
    (g) => g.genre === game.genre && g._id !== game._id
  );

  return (
    <div style={styles.pageFrame}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <div
        style={{
          ...styles.pageWrapper,
          opacity: animate ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {/* ----------------------- BANNER ----------------------- */}
        <div style={styles.bannerWrapper}>
          <img src={bannerImg} alt={game.title} style={styles.bannerImg} />
          <div style={styles.bannerGradient}></div>

          <div style={styles.bannerContent}>
            <h1 style={styles.gameTitle}>{game.title}</h1>
            <p style={styles.genre}>{game.genre}</p>

            <RatingStars rating={game.rating} />

            {!startGame && (
              <button
                onClick={() => {
                  setStartGame(true);
                  setTimeout(() => {
                    window.scrollTo({ top: 330, behavior: "smooth" });
                  }, 200);
                }}
                style={styles.playBtn}
              >
                ▶ Play Now
              </button>
            )}
          </div>
        </div>

        {/* ----------------------- STATS ----------------------- */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statValue}>{game.playCount}</span>
            <span style={styles.statLabel}>Plays</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statValue}>{game.rating}</span>
            <span style={styles.statLabel}>Rating</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statValue}>
              {new Date(game.updatedAt).getFullYear()}
            </span>
            <span style={styles.statLabel}>Updated</span>
          </div>
        </div>

        {/* ----------------------- DESCRIPTION ----------------------- */}
        <div style={styles.descriptionBox}>
          <h3 style={styles.aboutTitle}>About This Game</h3>
          <p style={styles.description}>
            {game.description || "No description available."}
          </p>

          <div style={styles.tagsRow}>
            <span style={styles.tag}>🎮 {game.genre}</span>
            <span style={styles.tag}>⚡ Fast Gameplay</span>
            <span style={styles.tag}>🔥 Popular</span>
          </div>
        </div>

        {/* ----------------------- GAME PLAYER ----------------------- */}
        {startGame && (
          <div style={styles.playerWrapper}>
            <GamePlayer gameUrl={game.playUrl} />
          </div>
        )}

        {/* ----------------------- RELATED GAMES ----------------------- */}
        {related.length > 0 && (
          <div style={styles.relatedSection}>
            <h3 style={styles.relatedTitle}>You Might Also Like</h3>

            <div style={styles.slider}>
              {related.map((g) => (
                <div
                  key={g._id}
                  style={styles.sliderCard}
                  onClick={() => navigate(`/game/${g.slug}`)}
                >
                  <img
                    src={
                      g.thumbnail?.startsWith("/uploads")
                        ? `http://localhost:5000${g.thumbnail}`
                        : g.thumbnail
                    }
                    alt={g.title}
                    style={styles.sliderImg}
                  />
                  <p style={styles.sliderName}>{g.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLES (same as your version) */
const styles = {
  pageFrame: {
    padding: "20px",
    color: "#fff",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  backBtn: {
    padding: "8px 12px",
    background: "#2563eb",
    borderRadius: 6,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "14px",
  },
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  bannerWrapper: {
    position: "relative",
    borderRadius: "18px",
    overflow: "hidden",
    height: "320px",
  },
  bannerImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.55)",
  },
  bannerGradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))",
  },
  bannerContent: {
    position: "absolute",
    bottom: "18px",
    left: "18px",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(8px)",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  gameTitle: {
    fontSize: "32px",
    fontWeight: 800,
    marginBottom: 6,
  },
  genre: {
    color: "#93c5fd",
    marginBottom: 6,
  },
  playBtn: {
    marginTop: 12,
    padding: "12px 20px",
    background: "linear-gradient(135deg,#059669,#10b981)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 18px rgba(16,185,129,0.4)",
  },
  statsRow: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },
  statBox: {
    textAlign: "center",
    padding: "10px 16px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    minWidth: "100px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: 700,
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  descriptionBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "18px",
    borderRadius: "12px",
  },
  aboutTitle: {
    marginBottom: 10,
    fontSize: "20px",
  },
  description: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    marginBottom: 14,
  },
  tagsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  tag: {
    background: "rgba(255,255,255,0.12)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  playerWrapper: {
    marginTop: 10,
  },
  relatedSection: {
    marginTop: 30,
  },
  relatedTitle: {
    fontSize: "22px",
    marginBottom: "12px",
  },
  slider: {
    display: "flex",
    gap: "18px",
    overflowX: "auto",
    paddingBottom: "10px",
  },
  sliderCard: {
    minWidth: "150px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#1e293b",
    cursor: "pointer",
    transition: "0.25s",
  },
  sliderImg: {
    width: "100%",
    height: "110px",
    objectFit: "cover",
  },
  sliderName: {
    textAlign: "center",
    color: "#e2e8f0",
    padding: "8px",
    fontSize: "14px",
  },
};
