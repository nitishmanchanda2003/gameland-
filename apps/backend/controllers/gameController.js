// backend/controllers/gameController.js
import Game from "../models/Game.js";
import extract from "extract-zip";
import fs from "fs";
import path from "path";
import slugify from "slugify";


/****************************************************
 * GET ALL GAMES
 ****************************************************/
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({ success: true, games });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch games" });
  }
};


/****************************************************
 * GET SINGLE GAME
 ****************************************************/
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json({ success: true, game });
  } catch (err) {
    res.status(500).json({ message: "Error fetching game" });
  }
};


/****************************************************
 * CREATE GAME  (THUMBNAIL + ZIP upload)
 ****************************************************/
export const createGame = async (req, res) => {
  try {
    const { title, genre, description } = req.body;

    if (!title || !genre) {
      return res.status(400).json({ message: "Title and genre are required" });
    }

    // Check files exist
    if (!req.files || !req.files.thumbnail || !req.files.gameZip) {
      return res.status(400).json({
        message: "Thumbnail image and Game ZIP file are required",
      });
    }

    // ⭐ SLUG
    const slug = slugify(title, { lower: true, strict: true });

    // ⭐ FILES
    const thumbnailFile = req.files.thumbnail[0];
    const zipFile = req.files.gameZip[0];

    // ⭐ Thumbnail URL
    const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;

    // ⭐ Extract ZIP into public/games/<slug>/
    const extractDir = path.join("public/games", slug);

    // If folder already exists → delete and recreate (clean update)
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    fs.mkdirSync(extractDir, { recursive: true });

    // Extract ZIP
    await extract(zipFile.path, {
      dir: path.resolve(extractDir),
    });

    // ⭐ Playable URL
    const playUrl = `/games/${slug}/index.html`;

    // ⭐ Save in DB
    const game = await Game.create({
      title,
      slug,
      genre,
      description,
      thumbnail: thumbnailURL,
      playUrl,
      rating: req.body.rating || 4.0,
    });

    res.json({
      success: true,
      message: "Game uploaded successfully 🎉",
      game,
    });

  } catch (err) {
    console.error("GAME UPLOAD ERROR:", err);
    res.status(500).json({ message: "Failed to upload game", error: err.message });
  }
};


/****************************************************
 * UPDATE GAME (META ONLY — no file change)
 ****************************************************/
export const updateGame = async (req, res) => {
  try {
    const updated = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Game not found" });

    res.json({ success: true, message: "Game updated", game: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update game" });
  }
};


/****************************************************
 * DELETE GAME (DELETE FOLDER + DB)
 ****************************************************/
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) return res.status(404).json({ message: "Game not found" });

    // Remove game folder
    const folderPath = path.join("public/games", game.slug);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    res.json({ success: true, message: "Game deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete game" });
  }
};
