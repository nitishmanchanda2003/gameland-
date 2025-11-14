// src/services/gameActions.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

/*************************************************
 * ⭐ SAFE PLAY COUNTER (Anti-Spam)
 * Frontend cooldown + Backend cooldown both active
 *************************************************/
export async function increasePlay(gameId) {
  const lastPlay = localStorage.getItem(`play_${gameId}`);
  const now = Date.now();

  // 👉 Prevent frontend spam (5 min)
  if (lastPlay && now - lastPlay < 5 * 60 * 1000) {
    return { ignored: true };
  }

  try {
    const res = await axios.post(`${BASE_URL}/games/${gameId}/play`);

    // Save frontend cooldown
    localStorage.setItem(`play_${gameId}`, now);

    return res.data;
  } catch (err) {
    console.log("Play count error:", err);
    return { success: false, error: true };
  }
}

/*************************************************
 * ⭐ EDITABLE RATING SYSTEM (Frontend Updated)
 * - User can change rating (stored in localStorage)
 * - Backend overwrites old IP rating & recalculates
 *************************************************/
export async function rateGame(gameId, stars) {
  try {
    const res = await axios.post(`${BASE_URL}/games/${gameId}/rate`, {
      stars,
    });

    // ⭐ Store user rating for UI memory
    localStorage.setItem(`rated_${gameId}`, stars);

    return {
      success: true,
      rating: res.data.rating, // updated avg rating
    };
  } catch (err) {
    console.log("Rating error:", err);

    // Backend returns { message: "..." }
    const msg = err?.response?.data?.message || "Rating failed";

    return { success: false, message: msg };
  }
}
