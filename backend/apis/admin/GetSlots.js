const connectDB = require("../../db/dbConnect");
async function GetAdminSlots(req, res) {
  try {
    const db = await connectDB();
    const slots = await db.collection("game_slots").aggregate([
      { $lookup: { from: "games", localField: "game_id", foreignField: "_id", as: "game" } },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Slots fetched successfully", data: slots });
  } catch (error) {
    console.error("admin/GetSlots.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetAdminSlots };
