// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>
          🎮 Gameland
        </Link>
      </div>

      <div style={styles.right}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/categories" style={styles.link}>
          Categories
        </Link>
        <Link to="/profile" style={styles.link}>
          Profile
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    color: "#fff",
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  brand: { color: "#fff", fontSize: 20, textDecoration: "none", fontWeight: 700 },
  right: { display: "flex", gap: 16, alignItems: "center" },
  link: { color: "#cfe8ff", textDecoration: "none", fontSize: 14 },
};
