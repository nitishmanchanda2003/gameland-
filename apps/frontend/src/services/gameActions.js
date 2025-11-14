// src/services/gameActions.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

/*************************************************
 * ⭐ SAFE PLAY COUNTER (Anti-Spam System)
 * - Prevents user from increasing plays again & again
 * - Allows only once per 5 minutes per game
 *************************************************/
export async function increasePlay(gameId) {
  const lastPlay = localStorage.getItem(`play_${gameId}`);
  const now = Date.now();

  // 👉 Prevent spam play increase (5 minute cooldown)
  if (lastPlay && now - lastPlay < 5 * 60 * 1000) {
    return { ignored: true };
  }

  try {
    const res = await axios.post(`${BASE_URL}/games/${gameId}/play`);

    // Store timestamp
    localStorage.setItem(`play_${gameId}`, now);

    return res.data;
  } catch (err) {
    console.log("Play count error:", err);
    return { error: true };
  }
}


/*************************************************
 * ⭐ SAFE RATING SYSTEM (User cannot rate again)
 * - Local lock prevents duplicate rating
 * - User can see that rating is already given
 *************************************************/
export async function rateGame(gameId, stars) {
  const alreadyRated = localStorage.getItem(`rated_${gameId}`);

  // If already rated → BLOCK
  if (alreadyRated) {
    return {
      blocked: true,
      rating: Number(alreadyRated),
    };
  }

  try {
    const res = await axios.post(`${BASE_URL}/games/${gameId}/rate`, {
      stars,
    });

    // Lock rating in localStorage
    localStorage.setItem(`rated_${gameId}`, stars);

    return res.data;
  } catch (err) {
    console.log("Rating error:", err);
    return { error: true };
  }
}
