// src/components/GamePlayer.jsx
import React, { useEffect, useRef, useState } from "react";

export default function GamePlayer({ gameId }) {
  const src = `/games/${gameId}/index.html`;

  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setFailed(false);

    timeoutRef.current = setTimeout(() => {
      if (loading) {
        setFailed(true);
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line
  }, [gameId]);

  const handleLoad = () => {
    clearTimeout(timeoutRef.current);
    setLoading(false);
    setFailed(false);
  };

  const handleFullscreen = () => {
    const iframe = iframeRef.current;

    if (iframe?.requestFullscreen) iframe.requestFullscreen();
    else if (iframe?.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
    else if (iframe?.mozRequestFullScreen) iframe.mozRequestFullScreen();
    else if (iframe?.msRequestFullscreen) iframe.msRequestFullscreen();
  };

  return (
    <div style={styles.container}>
      
      {/* Top header bar */}
      <div style={styles.topBar}>
        <span style={styles.gameTitle}>▶ Playing Game</span>

        {/* Fullscreen button */}
        <button style={styles.fullscreenBtn} onClick={handleFullscreen}>
          ⛶ Fullscreen
        </button>
      </div>

      {/* Game area */}
      <div style={styles.playerArea}>
        
        {/* Loading overlay */}
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.glowSpinner}></div>
            <p style={styles.loadingText}>Loading game…</p>
          </div>
        )}

        {/* Error state */}
        {failed && (
          <div style={styles.errorOverlay}>
            <h3 style={{ color: "#fff", marginBottom: 4 }}>
              Failed to load game
            </h3>
            <p style={{ color: "#94a3b8" }}>Please reload or try again later</p>
          </div>
        )}

        {/* Iframe */}
        {!failed && (
          <iframe
            ref={iframeRef}
            title={`game-${gameId}`}
            src={src}
            onLoad={handleLoad}
            style={{
              ...styles.iframe,
              opacity: loading ? 0 : 1,
              transition: "opacity 0.4s ease",
            }}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
            allow="fullscreen"
          ></iframe>
        )}
      </div>
    </div>
  );
}

// styles
const styles = {
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  topBar: {
    padding: "10px 14px",
    background:
      "linear-gradient(90deg, rgba(14,165,233,0.10), rgba(99,102,241,0.05))",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  gameTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
  },

  fullscreenBtn: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    transition: "background 0.2s",
  },

  playerArea: {
    position: "relative",
    width: "100%",
    height: "70vh",
    minHeight: 350,
    background: "#000",
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    background: "#000",
  },

  loadingOverlay: {
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(4px)",
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  glowSpinner: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "6px solid rgba(255,255,255,0.15)",
    borderTopColor: "#3b82f6",
    animation: "spin 1.1s linear infinite",
    boxShadow: "0 0 12px #3b82f6",
  },

  loadingText: {
    marginTop: 12,
    color: "#cbd5e1",
    fontSize: 14,
    letterSpacing: "0.3px",
  },

  errorOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #0f172a, #1e293b)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
};
