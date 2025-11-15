// backend/controllers/favoriteController.js
import User from "../models/User.js";
import Game from "../models/Game.js";

/***************************************************
 * ⭐ ADD / REMOVE FROM FAVORITES (TOGGLE SYSTEM)
 ***************************************************/
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;  // from protect middleware
    const gameId = req.params.gameId;

    const user = await User.findById(userId);
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Force to string for clean comparison
    const exists = user.favorites.some((id) => id.toString() === gameId);

    if (exists) {
      // ⭐ REMOVE FROM FAVORITES
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== gameId
      );
      await user.save();

      const populated = await user.populate(
        "favorites",
        "title slug thumbnail genre rating playCount"
      );

      return res.json({
        success: true,
        action: "removed",
        favorites: populated.favorites,
      });
    }

    // ⭐ ADD TO FAVORITES
    user.favorites.push(gameId);
    await user.save();

    const populated = await user.populate(
      "favorites",
      "title slug thumbnail genre rating playCount"
    );

    return res.json({
      success: true,
      action: "added",
      favorites: populated.favorites,
    });

  } catch (err) {
    console.error("FAVORITE TOGGLE ERROR:", err);
    return res.status(500).json({ message: "Failed to update favorites" });
  }
};


/***************************************************
 * ⭐ GET LOGGED-IN USER FAVORITES
 ***************************************************/
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "favorites",
      "title slug thumbnail genre rating playCount"
    );

    return res.json({
      success: true,
      favorites: user.favorites || [],
    });

  } catch (err) {
    console.error("FETCH FAV ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch favorites" });
  }
};
