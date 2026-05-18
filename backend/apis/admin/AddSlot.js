const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function AddSlot(req, res) {
  try {
    const { game_id, slot_time_start, slot_time_end, duration, price } = req.body;
    if (!game_id || !slot_time_start || !slot_time_end || !duration || !price) return res.status(400).json({ success: false, message: "All fields are required" });
    if (!ObjectId.isValid(game_id)) return res.status(400).json({ success: false, message: "Invalid game ID" });
    const db = await connectDB();
    const gameExists = await db.collection("games").findOne({ _id: new ObjectId(game_id) });
    if (!gameExists) return res.status(404).json({ success: false, message: "Game not found" });
    await db.collection("game_slots").insertOne({ game_id: new ObjectId(game_id), slot_time_start, slot_time_end, duration: parseInt(duration), price: parseInt(price), status: "Available", created_at: new Date() });
    return res.status(201).json({ success: true, message: "Slot added successfully" });
  } catch (error) {
    console.error("AddSlot.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { AddSlot };
