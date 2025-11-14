// src/pages/Profile.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/**
 * Profile page
 * - Shows avatar (with robust fallback)
 * - Lets user pick a new image and upload it to /api/user/avatar
 * - Calls updateUser(updatedUser) from AuthContext so Navbar updates immediately
 *
 * NOTE: backend endpoint expected: POST /api/user/avatar
 * - Accepts multipart/form-data with field name "avatar"
 * - Returns updated user object (e.g. { user: { ... } } or directly the user)
 */

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const inputRef = useRef(null);

  // preview will show (in order): local picked file preview -> user.picture -> user.avatar -> placeholder
  const initialPreview =
    (typeof window !== "undefined" && sessionStorage.getItem("profile_preview")) ||
    user?.picture ||
    user?.avatar ||
    "https://i.ibb.co/YT1y9VJ/default-avatar.png";

  const [preview, setPreview] = useState(initialPreview);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

   const socialLinks = [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/", icon: "📸" },
    { id: "twitter", label: "Twitter", href: "https://twitter.com/", icon: "🐦" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/", icon: "🔗" },
   
  ];

  // if user changes (e.g. login / logout), refresh preview
  useEffect(() => {
    setPreview(user?.picture || user?.avatar || "https://i.ibb.co/YT1y9VJ/default-avatar.png");
  }, [user]);

  // Cleanup any created object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch {}
      }
      sessionStorage.removeItem("profile_preview");
    };
  }, [preview]);

  function triggerPick() {
    setErr("");
    setMsg("");
    inputRef.current?.click();
  }

  function handleFilePick(e) {
    setErr("");
    setMsg("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErr("Please select an image file.");
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      setErr("Max file size 4MB. Please pick a smaller file.");
      return;
    }

    // create preview URL
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);

    // store temporarily so reload doesn't immediately lose preview during dev
    try {
      sessionStorage.setItem("profile_preview", url);
    } catch {}

    // clear previous messages
    setMsg("");
  }

  async function handleUpload() {
    setErr("");
    setMsg("");

    if (!file) {
      setErr("Please choose a photo first.");
      return;
    }

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      setLoading(true);

      // axios.defaults.headers should already include Authorization from AuthContext
      const res = await axios.post("/api/user/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30_000,
      });

      // server might return { user: {...} } or {...}
      const updatedUser = res.data?.user || res.data;
      if (!updatedUser) {
        setErr("Upload succeeded but server did not return updated user.");
        return;
      }

      // update context so Navbar + other parts refresh
      if (typeof updateUser === "function") updateUser(updatedUser);

      setMsg("Profile updated successfully.");
      setFile(null);

      // if preview was blob URL, keep it briefly then revoke
      setTimeout(() => {
        try {
          if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
            sessionStorage.removeItem("profile_preview");
          }
        } catch {}
      }, 1200);
    } catch (error) {
      console.error("Avatar upload error:", error);
      setErr(error.response?.data?.message || error.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Your Profile</h1>
        <div style={styles.grid}>
          {/* LEFT: avatar + controls */}
          <div style={styles.leftCol}>
            <div style={styles.avatarWrap}>
              <img
                src={preview}
                alt="avatar"
                style={styles.avatar}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://i.ibb.co/YT1y9VJ/default-avatar.png";
                }}
              />
              <button
                type="button"
                onClick={triggerPick}
                aria-label="Edit profile picture"
                style={styles.editBtn}
                title="Choose a new photo"
              >
                ✎
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFilePick}
              />
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 75 }}>
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                style={{ ...styles.primaryBtn, opacity: !file ? 0.6 : 1 }}
              >
                {loading ? "Uploading…" : file ? "Upload photo" : "Choose photo"}
              </button>

              <button
                onClick={() => {
                  logout?.();
                  navigate("/login");
                }}
                style={styles.ghostBtn}
              >
                Logout
              </button>
            </div>

            {msg && <div style={styles.success}>{msg}</div>}
            {err && <div style={styles.error}>{err}</div>}
          </div>

          {/* CENTER: user info */}
          <div style={styles.rightCol}>
            <div style={styles.infoRow}>
              <div>
                <div style={styles.infoLabel}>Name</div>
                <div style={styles.infoValue}>{user?.name || "-"}</div>
              </div>
            </div>

            <div style={styles.infoRow}>
              <div>
                <div style={styles.infoLabel}>Email</div>
                <div style={styles.infoValueSmall}>{user?.email || "-"}</div>
              </div>
            </div>
          </div>

          {/* RIGHT: social column — moved OUTSIDE rightCol so it stays to the right vertically */}
          <div style={styles.socialCol} aria-hidden={false}>
            <div style={styles.socialTitle}>Social</div>
            <ul style={styles.socialList}>
              {socialLinks.map((s) => (
                <li key={s.id} style={styles.socialItem}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    style={styles.socialLink}
                    aria-label={s.label}
                  >
                    <span style={styles.socialIcon}>{s.icon}</span>
                    <span style={styles.socialLabel}>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>


      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */
/* Inline styles to match the rest of your project.
   Adjust colors / sizes if needed. */
const styles = {
  wrapper: {
    minHeight: "calc(100vh - 70px)",
    background: "#0f172a",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-start",
    padding: "0px 20px 40px",
  },

  card: {
    width: "100%",
    maxWidth: 790,
    background: "rgba(17,25,40,0.65)",
    backdropFilter: "blur(12px)",
    borderRadius: 16,
    padding: 26,
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e6f0ff",
  },

  title: { color: "#e6f0ff", fontSize: 22, fontWeight: 800, marginBottom: 18 },

  grid: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
  },

  leftCol: {
    width: 160,
    minWidth: 160,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  avatarWrap: {
    position: "relative",
    width: 110,
    height: 110,
    borderRadius: 14,
    overflow: "hidden",
    border: "3px solid rgba(255,255,255,0.03)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
    background: "#071224",
  },

  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    background: "#071224",
  },

  editBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    borderRadius: 10,
    border: "none",
    padding: "7px 9px",
    cursor: "pointer",
    fontWeight: 700,
    background: "linear-gradient(90deg,#3b82f6,#6366f1)",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(99,102,241,0.18)",
  },

  primaryBtn: {
    padding: "10px 27px",
    borderRadius: 10,
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
    background: "linear-gradient(90deg,#3b82f6,#6366f1)",
    color: "#fff",
  },

  ghostBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "transparent",
    color: "#cfe8ff",
    cursor: "pointer",
    fontWeight: 700,
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 6,
  },

  infoLabel: { color: "#9fb7d9", fontSize: 13, fontWeight: 700, marginBottom: 4 },
  infoValue: { color: "#e6f0ff", fontWeight: 800, fontSize: 16 },
  infoValueSmall: { color: "#e6f0ff", fontWeight: 700, fontSize: 14 },

  success: {
    marginTop: 12,
    background: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.18)",
    padding: 10,
    borderRadius: 8,
    color: "#bbf7d0",
  },

  error: {
    marginTop: 12,
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.18)",
    padding: 10,
    borderRadius: 8,
    color: "#fecaca",
  },

  hint: {
    marginTop: 14,
    color: "#9fb7d9",
    fontSize: 13,
  },

  /* Social list styles (vertical) */
  socialTitle: {
    color: "#9fb7d9",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 12,
  },

  socialList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    alignItems: "center",
  },

  socialItem: {
    width: "100%",
  },

  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    padding: "8px 10px",
    borderRadius: 10,
    width: "100%",
    justifyContent: "flex-start",
    background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))",
    border: "1px solid rgba(255,255,255,0.03)",
    color: "#e6f0ff",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    boxShadow: "inset 0 -6px 18px rgba(2,6,23,0.25)",
  },

  socialIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    background: "linear-gradient(90deg,#3b82f6,#6366f1)",
    color: "#fff",
    flexShrink: 0,
  },

  socialLabel: {
    fontSize: 13,
    fontWeight: 800,
    color: "#e6f0ff",
  },

};
