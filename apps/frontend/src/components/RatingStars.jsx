// src/components/RatingStars.jsx
import React, { useState, useEffect } from "react";

/**
 * Props:
 * rating      = backend average rating (float)
 * userRating  = user's own rating (optional)
 * size        = star size
 * onRate      = callback when user rates
 * showUserTag = show "You rated X" or "Please rate" (default: false)
 */
export default function RatingStars({
  rating = 4,
  userRating = null,
  size = 22,
  onRate = null,
  showUserTag = false,
}) {
  const [hovered, setHovered] = useState(0);
  const [display, setDisplay] = useState(userRating || rating);

  // Update display when props change
  useEffect(() => {
    setDisplay(userRating || rating);
  }, [rating, userRating]);

  const totalStars = 5;

  const handleClick = (value) => {
    if (!onRate) return; // read-only

    setDisplay(value);
    onRate(value);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {[...Array(totalStars)].map((_, i) => {
          const value = i + 1;

          return (
            <span
              key={value}
              style={{
                ...styles.star,
                fontSize: size,
                cursor: onRate ? "pointer" : "default",
                color: value <= (hovered || display) ? "#facc15" : "#475569",
                transform: hovered === value ? "scale(1.25)" : "scale(1)",
              }}
              onMouseEnter={() => onRate && setHovered(value)}
              onMouseLeave={() => onRate && setHovered(0)}
              onClick={() => handleClick(value)}
            >
              ★
            </span>
          );
        })}

        {/* ⭐ Always show backend avg rating number on read-only places */}
        {!onRate && (
          <span style={{ ...styles.text, fontSize: size * 0.65 }}>
            {rating.toFixed(1)}
          </span>
        )}

        {/* ⭐ On GameDetail: show user message */}
        {showUserTag && onRate && (
          <span style={{ ...styles.userTag, fontSize: size * 0.6 }}>
            {userRating
              ? `You rated: ${userRating} ★`
              : "Please rate this game"}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  star: {
    transition: "all 0.25s ease",
  },
  text: {
    marginLeft: 6,
    color: "#cbd5e1",
    fontWeight: 500,
  },
  userTag: {
    marginLeft: 10,
    color: "#94a3b8",
  },
};
