// backend/controllers/gameController.js
import Game from "../models/Game.js";
import User from "../models/User.js";
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
    game.averageRating * 20 +
    game.playCount * 2 +
    Math.max(0, 50 - days)
  );
};

const calculatePopularScore = (game) => {
  return game.playCount * 3 + game.averageRating * 10;
};

/*******************************************
 * GET ALL GAMES
 *******************************************/
export const getAllGames = async (req, res) => {
  try {
    let games = await Game.find()
      .sort({ createdAt: -1 })
      .populate("ratings.user", "_id name email");

    const finalGames = games.map((g) => ({
      ...g._doc,
      trendingScore: calculateTrendingScore(g),
      popularScore: calculatePopularScore(g),
    }));

    return res.json({ success: true, games: finalGames });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch games" });
  }
};

/*******************************************
 * GET GAME BY ID
 *******************************************/
export const getGameById = async (req, res) => {
  try {
    const g = await Game.findById(req.params.id).populate(
      "ratings.user",
      "_id name email"
    );

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
    const g = await Game.findOne({ slug: req.params.slug }).populate(
      "ratings.user",
      "_id name email"
    );

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
    return res
      .status(500)
      .json({ message: "Error fetching game by slug" });
  }
};

/*******************************************
 * CREATE GAME — FIXED
 *******************************************/
export const createGame = async (req, res) => {
  try {
    const { title, genre, description } = req.body;

    if (!req.files?.thumbnail || !req.files?.gameZip) {
      return res
        .status(400)
        .json({ message: "Thumbnail & ZIP required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const thumbnailFile = req.files.thumbnail[0];
    const zipFile = req.files.gameZip[0];

    const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;

    const extractDir = path.join("public", "games", slug);

    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true });
    }

    fs.mkdirSync(extractDir, { recursive: true });

    try {
      await extract(zipFile.path, { dir: path.resolve(extractDir) });
    } catch (err) {
      return res.status(400).json({ message: "Invalid ZIP file" });
    }

    let indexPath = "";
    const scan = (dir) => {
      const items = fs.readdirSync(dir);
      for (let item of items) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) scan(full);
        else if (item.toLowerCase() === "index.html") indexPath = full;
      }
    };
    scan(extractDir);

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
      averageRating: 4.0,
      totalRatings: 0,
      ratings: [],
      playedIPs: [],
      playCount: 0,
    });

    return res.json({
      success: true,
      message: "Game uploaded",
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
    return res
      .status(500)
      .json({ message: "Failed to update game" });
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
    return res
      .status(500)
      .json({ message: "Failed to delete game" });
  }
};

/*******************************************
 * ⭐ INCREASE PLAY COUNT — FIXED
 *******************************************/
export const increasePlayCount = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game)
      return res.status(404).json({ message: "Game not found" });

    game.playCount += 1;
    await game.save();

    return res.json({
      success: true,
      playCount: game.playCount,
    });
  } catch (err) {
    console.log("PLAYCOUNT ERROR:", err);
    return res.status(500).json({ message: "Failed to increase play" });
  }
};

/*******************************************
 * ⭐ USER RATING — FIXED
 *******************************************/
export const rateGame = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }

    const userId = req.user._id.toString();
    const { stars } = req.body;

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be 1–5" });
    }

    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const existing = game.ratings.find((r) => {
      const rUser = r.user?._id?.toString() ?? r.user?.toString();
      return rUser === userId;
    });

    if (existing) existing.stars = stars;
    else game.ratings.push({ user: userId, stars });

    const user = await User.findById(userId);

    const uRated = user.ratedGames.find(
      (r) => r.game.toString() === game._id.toString()
    );

    if (uRated) uRated.stars = stars;
    else user.ratedGames.push({ game: game._id, stars });

    const total = game.ratings.length;
    const sum = game.ratings.reduce((a, r) => a + r.stars, 0);

    game.totalRatings = total;
    game.averageRating = Number((sum / total).toFixed(2));

    await user.save();
    await game.save();

    return res.json({
      success: true,
      rating: game.averageRating,
      totalRatings: game.totalRatings,
      userRating: stars,
    });
  } catch (err) {
    console.log("RATE GAME ERROR:", err);
    return res.status(500).json({ message: "Failed to rate game" });
  }
};
