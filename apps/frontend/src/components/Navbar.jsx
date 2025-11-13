// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const BREAKPOINT = 900; // px

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : false
  );
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // keep menu closed when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);        

  // watch resize
  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth <= BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setOpen(false); // ensure mobile menu closed on desktop
    }
    window.addEventListener("resize", onResize);
    // run once to sync
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header style={styles.header}>
      <nav style={styles.nav} aria-label="Main navigation">
        {/* Left (Brand) */}
        <div style={styles.left}>
          <Link to="/" style={styles.brand}>
            <span style={styles.logoEmoji} aria-hidden>
              🎮
            </span>
            <span style={styles.brandText}>Gameland</span>
          </Link>
        </div>

        {/* Center (Links) - visible only on desktop */}
        <div style={{ ...styles.center, display: isMobile ? "none" : "flex" }}>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.link,
                ...(location.pathname === l.to ? styles.linkActive : {}),
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right (Actions) */}
        <div style={styles.right}>
          {/* Desktop: maybe profile / other icons could go here in future */}
          {/* Mobile: show hamburger */}
          {isMobile ? (
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              style={{
                ...styles.hamburgerBtn,
                ...(open ? styles.hamburgerBtnActive : {}),
              }}
            >
              <span style={{ ...styles.hamburgerBar, ...(open ? styles.bar1Active : {}) }} />
              <span style={{ ...styles.hamburgerBar, ...(open ? styles.bar2Active : {}) }} />
              <span style={{ ...styles.hamburgerBar, ...(open ? styles.bar3Active : {}) }} />
            </button>
          ) : null}
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {isMobile && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            ...styles.mobileMenu,
            transform: open ? "translateY(0)" : "translateY(-8px)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div style={styles.mobileInner}>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{
                  ...styles.mobileLink,
                  ...(location.pathname === l.to ? styles.mobileLinkActive : {}),
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 60,
    width: "100%",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    background:
      "linear-gradient(180deg, rgba(10,18,28,0.45) 0%, rgba(7,10,16,0.25) 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    boxSizing: "border-box",
    transition: "box-shadow 220ms ease, background 220ms ease, border-color 220ms ease",
  },
  nav: {
    maxWidth: 1350,
    margin: "0 auto",
    padding: "12px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    boxSizing: "border-box",
    width: "100%",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#fff",
  },
  logoEmoji: {
    fontSize: 20,
    display: "inline-block",
    transform: "translateY(1px)",
  },
  brandText: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: 0.4,
    color: "#e6f0ff",
    whiteSpace: "nowrap",
  },

  center: {
    display: "flex",
    gap: 22,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 44,
    justifyContent: "flex-end",
  },

  link: {
    color: "#bfe0ff",
    textDecoration: "none",
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: 8,
    transition: "all 160ms ease",
    outline: "none",
  },
  linkActive: {
    color: "#fff",
    boxShadow: "0 6px 18px rgba(59,130,246,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))",
  },

  // Hamburger
  hamburgerBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: 44,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 6,
    transition: "transform 180ms ease",
  },
  hamburgerBtnActive: {
    transform: "scale(0.98)",
  },
  hamburgerBar: {
    display: "block",
    width: 20,
    height: 2,
    borderRadius: 2,
    background: "linear-gradient(90deg, #93c5fd, #60a5fa)",
    transition: "all 220ms ease",
    transformOrigin: "center",
  },
  bar1Active: {
    transform: "translateY(6px) rotate(45deg)",
  },
  bar2Active: {
    opacity: 0,
    transform: "scaleX(0.6)",
  },
  bar3Active: {
    transform: "translateY(-6px) rotate(-45deg)",
  },

  // Mobile menu
  mobileMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    background: "linear-gradient(180deg, rgba(8,14,22,0.95), rgba(7,10,16,0.98))",
    borderTop: "1px solid rgba(255,255,255,0.02)",
    boxShadow: "0 10px 40px rgba(2,6,23,0.6)",
    transition: "opacity 200ms ease, transform 200ms ease",
    willChange: "transform, opacity",
    zIndex: 55,
  },
  mobileInner: {
    maxWidth: 1350,
    margin: "10px auto",
    padding: "12px 22px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  mobileLink: {
    display: "inline-block",
    padding: "12px 14px",
    borderRadius: 10,
    textDecoration: "none",
    color: "#e6f0ff",
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    fontWeight: 600,
  },
  mobileLinkActive: {
    background: "linear-gradient(90deg, rgba(59,130,246,0.12), rgba(59,130,246,0.06))",
    color: "#fff",
  },
};
