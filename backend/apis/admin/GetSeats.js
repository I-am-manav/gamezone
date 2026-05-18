const connectDB = require("../../db/dbConnect");
async function GetAdminSeats(req, res) {
  try {
    const db = await connectDB();
    const seats = await db.collection("seats").aggregate([
      { $lookup: { from: "games", localField: "game_id", foreignField: "_id", as: "game" } },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true } },
      { $sort: { "game.name": 1, seat_no: 1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Seats fetched successfully", data: seats });
  } catch (error) {
    console.error("admin/GetSeats.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetAdminSeats };
