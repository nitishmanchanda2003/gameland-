// src/components/RatingStars.jsx
import React from "react";

export default function RatingStars({ rating = 4 }) {
  const totalStars = 5;

  return (
    <div style={styles.container}>
      {[...Array(totalStars)].map((_, index) => (
        <span
          key={index}
          style={{
            ...styles.star,
            color: index < rating ? "#ffcc00" : "#555",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffd700";
            e.currentTarget.style.textShadow = "0 0 5px #ffd700";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = index < rating ? "#ffcc00" : "#555";
            e.currentTarget.style.textShadow = "none";
          }}
        >
          ★
        </span>
      ))}
      <span style={styles.text}>{rating.toFixed(1)}</span>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "6px",
  },
  star: {
    fontSize: "18px",
    transition: "color 0.2s, text-shadow 0.2s ease-in-out",
  },
  text: {
    fontSize: "14px",
    color: "#ccc",
    marginLeft: "4px",
  },
};
