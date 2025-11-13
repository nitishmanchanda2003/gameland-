// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";   // ⭐ AUTH

const BREAKPOINT = 900;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();   // ⭐ GLOBAL USER + LOGOUT

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : false
  );
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    ...(user ? [{ to: "/profile", label: "Profile" }] : []),
  ];

  const handleLogout = () => {
    logout();         // ⭐ CLEAR AUTH
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        
        {/* LEFT */}
        <div style={styles.left}>
          <Link to="/" style={styles.brand}>
            <span style={styles.logoEmoji}>🎮</span>
            <span style={styles.brandText}>Gameland</span>
          </Link>
        </div>

        {/* CENTER (desktop) */}
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

        {/* RIGHT (desktop) */}
        {!isMobile && (
          <div style={styles.right}>
            {!user ? (
              <>
                <Link
                  to="/login"
                  style={styles.btnLogin}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  style={styles.btnRegister}
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                style={{
                  ...styles.btnLogin,
                  border: "1px solid rgba(255,80,80,0.35)",
                  color: "#ffb3b3",
                }}
              >
                Logout
              </button>
            )}
          </div>
        )}

        {/* MOBILE MENU BUTTON */}
        {isMobile && (
          <div style={styles.right}>
            <button
              onClick={() => setOpen(!open)}
              style={{
                ...styles.hamburgerBtn,
                ...(open ? styles.hamburgerBtnActive : {}),
              }}
            >
              <span
                style={{
                  ...styles.hamburgerBar,
                  ...(open ? styles.bar1Active : {}),
                }}
              />
              <span
                style={{
                  ...styles.hamburgerBar,
                  ...(open ? styles.bar2Active : {}),
                }}
              />
              <span
                style={{
                  ...styles.hamburgerBar,
                  ...(open ? styles.bar3Active : {}),
                }}
              />
            </button>
          </div>
        )}
      </nav>

      {/* MOBILE MENU */}
      {isMobile && (
        <div
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
                  ...(location.pathname === l.to
                    ? styles.mobileLinkActive
                    : {}),
                }}
              >
                {l.label}
              </Link>
            ))}

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  style={styles.mobileLink}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  style={styles.mobileLink}
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                style={{
                  ...styles.mobileLink,
                  background: "transparent",
                  textAlign: "left",
                  border: "none",
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}



//
// -------- STYLES (unchanged — your original premium UI) --------
//
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
  },
  nav: {
    maxWidth: 1350,
    margin: "0 auto",
    padding: "12px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#fff",
  },
  logoEmoji: { fontSize: 20, transform: "translateY(1px)" },
  brandText: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: 0.4,
    color: "#e6f0ff",
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
    justifyContent: "flex-end",
  },

  link: {
    color: "#bfe0ff",
    textDecoration: "none",
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: 8,
    transition: "all 160ms ease",
  },
  linkActive: {
    color: "#fff",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    boxShadow: "0 6px 18px rgba(59,130,246,0.12)",
  },

  // ---------- PREMIUM BUTTONS ----------
  btnLogin: {
    padding: "8px 18px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#dbeafe",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 14,
    boxShadow: "0 0 18px rgba(59,130,246,0.15)",
    transition: "all 200ms ease",
  },
  btnLoginHover: {
    background: "rgba(255,255,255,0.12)",
    boxShadow: "0 0 22px rgba(59,130,246,0.28)",
  },

  btnRegister: {
    padding: "8px 20px",
    borderRadius: 10,
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
    border: "none",
    boxShadow: "0 0 20px rgba(99,102,241,0.45)",
    transition: "all 200ms ease",
  },
  btnRegisterHover: {
    transform: "scale(1.04)",
    boxShadow: "0 0 28px rgba(99,102,241,0.65)",
  },

  // ---------- HAMBURGER ----------
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
  hamburgerBtnActive: { transform: "scale(0.98)" },

  hamburgerBar: {
    display: "block",
    width: 20,
    height: 2,
    borderRadius: 2,
    background: "linear-gradient(90deg, #93c5fd, #60a5fa)",
    transition: "all 220ms ease",
  },
  bar1Active: { transform: "translateY(6px) rotate(45deg)" },
  bar2Active: { opacity: 0, transform: "scaleX(0.6)" },
  bar3Active: { transform: "translateY(-6px) rotate(-45deg)" },

  // ---------- MOBILE MENU ----------
  mobileMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    background:
      "linear-gradient(180deg, rgba(8,14,22,0.95), rgba(7,10,16,0.98))",
    borderTop: "1px solid rgba(255,255,255,0.02)",
    boxShadow: "0 10px 40px rgba(2,6,23,0.6)",
    transition: "opacity 200ms ease, transform 200ms ease",
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
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    fontWeight: 600,
  },
  mobileLinkActive: {
    background: "linear-gradient(90deg, rgba(59,130,246,0.12), rgba(59,130,246,0.06))",
    color: "#fff",
  },
};
