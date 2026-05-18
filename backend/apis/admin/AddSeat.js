const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function AddSeat(req, res) {
  try {
    const { game_id, seat_no } = req.body;
    if (!game_id || !seat_no) return res.status(400).json({ success: false, message: "Game ID and seat number are required" });
    if (!ObjectId.isValid(game_id)) return res.status(400).json({ success: false, message: "Invalid game ID" });
    const db = await connectDB();
    const gameExists = await db.collection("games").findOne({ _id: new ObjectId(game_id) });
    if (!gameExists) return res.status(404).json({ success: false, message: "Game not found" });
    const seatExists = await db.collection("seats").findOne({ game_id: new ObjectId(game_id), seat_no });
    if (seatExists) return res.status(400).json({ success: false, message: "Seat number already exists for this game" });
    await db.collection("seats").insertOne({ game_id: new ObjectId(game_id), seat_no, status: "Available", created_at: new Date() });
    return res.status(201).json({ success: true, message: "Seat added successfully" });
  } catch (error) {
    console.error("AddSeat.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { AddSeat };
