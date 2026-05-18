const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetGameDetails(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid game ID" });
    }

    const db = await connectDB();

    const game = await db.collection("games").findOne({ _id: new ObjectId(id) });

    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    const slots = await db
      .collection("game_slots")
      .find({ game_id: new ObjectId(id) })
      .sort({ slot_time_start: 1 })
      .toArray();

    const seats = await db
      .collection("seats")
      .find({ game_id: new ObjectId(id) })
      .sort({ seat_no: 1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Game details fetched successfully",
      data: { ...game, slots, seats },
    });
  } catch (error) {
    console.error("GetGameDetails.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetGameDetails };
