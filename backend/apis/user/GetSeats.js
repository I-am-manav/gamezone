const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetSeats(req, res) {
  try {
    const { game_id } = req.params;

    if (!ObjectId.isValid(game_id)) {
      return res.status(400).json({ success: false, message: "Invalid game ID" });
    }

    const db = await connectDB();
    const seats = await db
      .collection("seats")
      .find({ game_id: new ObjectId(game_id) })
      .sort({ seat_no: 1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Seats fetched successfully",
      data: seats,
    });
  } catch (error) {
    console.error("GetSeats.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetSeats };
