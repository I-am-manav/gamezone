const connectDB = require("../../db/dbConnect");
async function GetAdminGames(req, res) {
  try {
    const db = await connectDB();
    const games = await db.collection("games").find({}).sort({ created_at: -1 }).toArray();
    return res.status(200).json({ success: true, message: "Games fetched successfully", data: games });
  } catch (error) {
    console.error("admin/GetGames.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetAdminGames };
