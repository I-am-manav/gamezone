const connectDB = require("../../db/dbConnect");

async function GetGames(req, res) {
  try {
    const db = await connectDB();
    const games = await db
      .collection("games")
      .find({ status: "Active" })
      .sort({ name: 1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Games fetched successfully",
      data: games,
    });
  } catch (error) {
    console.error("GetGames.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetGames };
