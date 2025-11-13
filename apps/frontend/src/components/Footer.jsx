// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div>
          <strong>Gameland</strong> — Play browser games, rate & enjoy.
        </div>
        <div style={styles.links}>
          <a href="#" style={styles.link}>About</a>
          <a href="#" style={styles.link}>Contact</a>
          <a href="#" style={styles.link}>Privacy</a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: 40,
    color: "#dbeafe",
    padding: "16px 20px",
  },
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 1100,
    margin: "0 auto",
    gap: 12,
    flexWrap: "wrap"
  },
  links: {
    display: "flex",
    gap: 12,
  },
  link: {
    color: "#9fd0ff",
    textDecoration: "none",
    fontSize: 14,
  },
};
