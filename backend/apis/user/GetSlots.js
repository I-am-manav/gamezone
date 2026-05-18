const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetSlots(req, res) {
  try {
    const { game_id } = req.params;

    if (!ObjectId.isValid(game_id)) {
      return res.status(400).json({ success: false, message: "Invalid game ID" });
    }

    const db = await connectDB();
    const slots = await db
      .collection("game_slots")
      .find({ game_id: new ObjectId(game_id), status: "Available" })
      .sort({ slot_time_start: 1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Slots fetched successfully",
      data: slots,
    });
  } catch (error) {
    console.error("GetSlots.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetSlots };
