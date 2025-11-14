// backend/controllers/gameController.js
import Game from "../models/Game.js";
import extract from "extract-zip";
import fs from "fs";
import path from "path";
import slugify from "slugify";

/*******************************************
 * GET ALL GAMES
 *******************************************/
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({ success: true, games });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch games" });
  }
};

/*******************************************
 * GET SINGLE GAME
 *******************************************/
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    res.json({ success: true, game });
  } catch (err) {
    res.status(500).json({ message: "Error fetching game" });
  }
};

/*******************************************
 * CREATE GAME  (Thumbnail + ZIP Upload)
 *******************************************/
export const createGame = async (req, res) => {
  try {
    const { title, genre, description, rating } = req.body;

    if (!title || !genre) {
      return res.status(400).json({ message: "Title and genre are required" });
    }

    if (!req.files || !req.files.thumbnail || !req.files.gameZip) {
      return res.status(400).json({
        message: "Thumbnail image and Game ZIP file are required",
      });
    }

    // Create slug
    const slug = slugify(title, { lower: true, strict: true });

    // Files
    const thumbnailFile = req.files.thumbnail[0];
    const zipFile = req.files.gameZip[0];

    // Thumbnail URL
    const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;

    // Extract folder
    const extractDir = path.join("public/games", slug);

    // Clean old folder if exists
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    fs.mkdirSync(extractDir, { recursive: true });

    // Extract ZIP
    await extract(zipFile.path, { dir: path.resolve(extractDir) });

    /*******************************************
     * 1. SEARCH FOR index.html ANYWHERE INSIDE ZIP
     *******************************************/
    let finalIndexPath = "";

    function searchForIndex(currentPath) {
      const items = fs.readdirSync(currentPath);

      for (let item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          searchForIndex(fullPath);
        } else if (item.toLowerCase() === "index.html") {
          finalIndexPath = fullPath;
        }
      }
    }

    searchForIndex(extractDir);

    if (!finalIndexPath) {
      return res.status(400).json({
        message: "index.html NOT FOUND inside uploaded ZIP",
      });
    }

    /*******************************************
     * 2. CONVERT ABSOLUTE PATH → PLAY URL
     *******************************************/
    let playUrl = finalIndexPath
      .replace("public", "")
      .replace(/\\/g, "/");

    // Save to DB
    const game = await Game.create({
      title,
      slug,
      genre,
      description,
      thumbnail: thumbnailURL,
      playUrl,
      rating: rating || 4.0,
      playCount: 0,
    });

    res.json({
      success: true,
      message: "Game uploaded successfully 🎮",
      game,
    });

  } catch (err) {
    console.error("GAME UPLOAD ERROR:", err);
    res.status(500).json({
      message: "Failed to upload game",
      error: err.message,
    });
  }
};

/*******************************************
 * UPDATE GAME
 *******************************************/
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!game) return res.status(404).json({ message: "Game not found" });

    res.json({ success: true, message: "Game updated", game });
  } catch (err) {
    res.status(500).json({ message: "Failed to update game" });
  }
};

/*******************************************
 * DELETE GAME
 *******************************************/
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) return res.status(404).json({ message: "Game not found" });

    const gameFolder = path.join("public/games", game.slug);

    if (fs.existsSync(gameFolder)) {
      fs.rmSync(gameFolder, { recursive: true, force: true });
    }

    res.json({ success: true, message: "Game deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete game" });
  }
};
