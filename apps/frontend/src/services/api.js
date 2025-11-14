// src/services/api.js
import axios from "axios";

// Base axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Auto attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**************************************
 *  AUTH API
 **************************************/
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

/**************************************
 *  GAMES API — FILE UPLOAD SUPPORTED
 **************************************/

// GET all games
export const getAllGames = () => API.get("/games");

// GET single game
export const getGameById = (id) => API.get(`/games/${id}`);

// CREATE — Thumbnail + Zip upload
export const createGame = (formData) =>
  API.post("/games", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// UPDATE — Thumbnail + Zip re-upload possible
export const updateGame = (id, formData) =>
  API.put(`/games/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DELETE
export const deleteGame = (id) => API.delete(`/games/${id}`);

/**************************************
 *  GAME ACTIONS (NEW)
 **************************************/

// ⭐ Increase play count
export const increasePlayCount = (id) => API.post(`/games/${id}/play`);

// ⭐ Rate the game
export const rateGame = (id, rating) =>
  API.post(`/games/${id}/rate`, { rating });

/**************************************
 *  TEST API
 **************************************/
export const getTestData = () => API.get("/test");

export default API;
