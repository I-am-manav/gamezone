const connectDB = require("../../db/dbConnect");
async function GetBookings(req, res) {
  try {
    const db = await connectDB();
    const bookings = await db.collection("bookings").aggregate([
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "games", localField: "game_id", foreignField: "_id", as: "game" } },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "game_slots", localField: "slot_id", foreignField: "_id", as: "slot" } },
      { $unwind: { path: "$slot", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "seats", localField: "seat_id", foreignField: "_id", as: "seat" } },
      { $unwind: { path: "$seat", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
      { $sort: { date: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Bookings fetched successfully", data: bookings });
  } catch (error) {
    console.error("GetBookings.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetBookings };
