const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function BookSeat(req, res) {
  try {
    const { game_id, slot_id, seat_id } = req.body;

    if (!game_id || !slot_id || !seat_id) return res.status(400).json({ success: false, message: "Game ID, slot ID and seat ID are required" });
    if (!ObjectId.isValid(game_id) || !ObjectId.isValid(slot_id) || !ObjectId.isValid(seat_id)) return res.status(400).json({ success: false, message: "Invalid ID provided" });

    const db = await connectDB();
    const game = await db.collection("games").findOne({ _id: new ObjectId(game_id), status: "Active" });
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });

    const slot = await db.collection("game_slots").findOne({ _id: new ObjectId(slot_id), game_id: new ObjectId(game_id), status: "Available" });
    if (!slot) return res.status(400).json({ success: false, message: "Slot is not available" });

    const seat = await db.collection("seats").findOne({ _id: new ObjectId(seat_id), game_id: new ObjectId(game_id), status: "Available" });
    if (!seat) return res.status(400).json({ success: false, message: "Seat is not available" });

    await db.collection("bookings").insertOne({
      user_id: new ObjectId(req.user._id),
      game_id: new ObjectId(game_id),
      slot_id: new ObjectId(slot_id),
      seat_id: new ObjectId(seat_id),
      date: new Date(),
      status: "Booked",
      payment_status: "Pending",
      amount: slot.price,
    });

    await db.collection("game_slots").updateOne({ _id: new ObjectId(slot_id) }, { $set: { status: "Booked" } });
    await db.collection("seats").updateOne({ _id: new ObjectId(seat_id) }, { $set: { status: "Booked" } });

    return res.status(201).json({ success: true, message: "Seat reserved successfully" });
  } catch (error) {
    console.error("BookSeat.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { BookSeat };
