// src/components/RatingStars.jsx
import React, { useState, useEffect } from "react";

/**
 * Props:
 * rating      = backend se avg rating (float)
 * userRating  = user ka diya hua rating (1–5)
 * size        = star size
 * onRate      = rating click handler (optional)
 */
export default function RatingStars({
  rating = 4,
  userRating = null,
  size = 22,
  onRate = null,
}) {
  const [hovered, setHovered] = useState(0);
  const [lockedRating, setLockedRating] = useState(userRating || rating);

  const totalStars = 5;

  // ⭐ If backend rating changes (after user submits), update UI
  useEffect(() => {
    setLockedRating(userRating || rating);
  }, [rating, userRating]);

  const displayRating = hovered || lockedRating;

  const handleClick = (value) => {
    if (!onRate) return;          // Read-only mode

    setLockedRating(value);       // UI lock
    onRate(value);                // Backend update
  };

  return (
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
              color: value <= displayRating ? "#facc15" : "#475569",
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

      {/* ⭐ Numeric rating: always show global avg rating */}
      <span style={{ ...styles.text, fontSize: size * 0.65 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "4px",
  },
  star: {
    transition: "all 0.25s ease",
  },
  text: {
    marginLeft: 6,
    color: "#cbd5e1",
    fontWeight: 500,
  },
};
