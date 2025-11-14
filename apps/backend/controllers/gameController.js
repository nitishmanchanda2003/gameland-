// backend/controllers/gameController.js
import Game from "../models/Game.js";
import extract from "extract-zip";
import fs from "fs";
import path from "path";
import slugify from "slugify";

/*******************************************
 * SCORE CALCULATIONS
 *******************************************/
const calculateTrendingScore = (game) => {
  const days =
    (Date.now() - new Date(game.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);

  return (
    game.rating * 20 +
    game.playCount * 2 +
    Math.max(0, 50 - days)
  );
};

const calculatePopularScore = (game) => {
  return game.playCount * 3 + game.rating * 10;
};

/*******************************************
 * GET ALL GAMES
 *******************************************/
export const getAllGames = async (req, res) => {
  try {
    let games = await Game.find().sort({ createdAt: -1 });

    const finalGames = games.map((g) => ({
      ...g._doc,
      trendingScore: calculateTrendingScore(g),
      popularScore: calculatePopularScore(g),
    }));

    return res.json({ success: true, games: finalGames });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch games" });
  }
};

/*******************************************
 * GET GAME BY ID
 *******************************************/
export const getGameById = async (req, res) => {
  try {
    const g = await Game.findById(req.params.id);
    if (!g) return res.status(404).json({ message: "Game not found" });

    return res.json({
      success: true,
      game: {
        ...g._doc,
        trendingScore: calculateTrendingScore(g),
        popularScore: calculatePopularScore(g),
      },
    });
  } catch {
    return res.status(500).json({ message: "Error fetching game" });
  }
};

/*******************************************
 * GET GAME BY SLUG
 *******************************************/
export const getGameBySlug = async (req, res) => {
  try {
    const g = await Game.findOne({ slug: req.params.slug });
    if (!g) return res.status(404).json({ message: "Game not found" });

    return res.json({
      success: true,
      game: {
        ...g._doc,
        trendingScore: calculateTrendingScore(g),
        popularScore: calculatePopularScore(g),
      },
    });
  } catch {
    return res.status(500).json({ message: "Error fetching game by slug" });
  }
};

/*******************************************
 * CREATE NEW GAME
 *******************************************/
export const createGame = async (req, res) => {
  try {
    const { title, genre, description } = req.body;

    if (!req.files?.thumbnail || !req.files?.gameZip) {
      return res.status(400).json({ message: "Thumbnail & ZIP required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const thumbnailFile = req.files.thumbnail[0];
    const zipFile = req.files.gameZip[0];

    const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;

    const extractDir = path.join("public/games", slug);
    if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });

    fs.mkdirSync(extractDir, { recursive: true });
    await extract(zipFile.path, { dir: path.resolve(extractDir) });

    let indexPath = "";
    const findIndex = (dir) => {
      const items = fs.readdirSync(dir);
      for (let file of items) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) findIndex(full);
        else if (file.toLowerCase() === "index.html") indexPath = full;
      }
    };
    findIndex(extractDir);

    if (!indexPath) {
      return res.status(400).json({ message: "index.html NOT found" });
    }

    const playUrl = indexPath.replace("public", "").replace(/\\/g, "/");

    const game = await Game.create({
      title,
      slug,
      genre,
      description,
      thumbnail: thumbnailURL,
      playUrl,
      rating: 4,
      totalRatings: 0,
      ratedIPs: [],
      playedIPs: [],
      playCount: 0,
    });

    return res.json({
      success: true,
      message: "Game Uploaded",
      game: {
        ...game._doc,
        trendingScore: calculateTrendingScore(game),
        popularScore: calculatePopularScore(game),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to upload game" });
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

    return res.json({
      success: true,
      message: "Game updated",
      game: {
        ...game._doc,
        trendingScore: calculateTrendingScore(game),
        popularScore: calculatePopularScore(game),
      },
    });
  } catch {
    return res.status(500).json({ message: "Failed to update game" });
  }
};

/*******************************************
 * DELETE GAME
 *******************************************/
export const deleteGame = async (req, res) => {
  try {
    const g = await Game.findByIdAndDelete(req.params.id);
    if (!g) return res.status(404).json({ message: "Game not found" });

    const folder = path.join("public/games", g.slug);
    if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });

    return res.json({ success: true, message: "Game deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete game" });
  }
};

/*******************************************
 * ⭐ INCREASE PLAYCOUNT (Anti-Spam)
 *******************************************/
export const increasePlayCount = async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const now = Date.now();
    const last = game.playedIPs.find((p) => p.ip === ip);

    if (last && now - last.time < 10 * 60 * 1000) {
      return res.json({ success: true, playCount: game.playCount, ignored: true });
    }

    game.playCount += 1;

    game.playedIPs = [
      ...game.playedIPs.filter((p) => p.ip !== ip),
      { ip, time: now },
    ];

    await game.save();

    return res.json({ success: true, playCount: game.playCount });
  } catch {
    return res.status(500).json({ message: "Failed to increase play" });
  }
};

/*******************************************
 * ⭐ RATE GAME (EDITABLE RATING SYSTEM)
 *******************************************/
export const rateGame = async (req, res) => {
  try {
    const { stars } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!stars || stars < 1 || stars > 5)
      return res.status(400).json({ message: "Stars must be 1–5" });

    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const existing = game.ratedIPs.find((r) => r.ip === ip);

    if (existing) {
      const oldStars = existing.stars;

      existing.stars = stars;

      game.rating = Number(
        (
          (game.rating * game.totalRatings - oldStars + stars) /
          game.totalRatings
        ).toFixed(2)
      );
    } else {
      game.rating = Number(
        (
          (game.rating * game.totalRatings + stars) /
          (game.totalRatings + 1)
        ).toFixed(2)
      );

      game.totalRatings += 1;
      game.ratedIPs.push({ ip, stars });
    }

    await game.save();

    return res.json({
      success: true,
      rating: Number(game.rating.toFixed(1)),
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to rate game" });
  }
};