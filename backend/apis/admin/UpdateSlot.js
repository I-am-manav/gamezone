const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateSlot(req, res) {
  try {
    const { id, slot_time_start, slot_time_end, duration, price, status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid slot ID is required" });
    const db = await connectDB();
    const updateFields = { updated_at: new Date() };
    if (slot_time_start) updateFields.slot_time_start = slot_time_start;
    if (slot_time_end) updateFields.slot_time_end = slot_time_end;
    if (duration) updateFields.duration = parseInt(duration);
    if (price) updateFields.price = parseInt(price);
    if (status) updateFields.status = status;
    const result = await db.collection("game_slots").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Slot not found" });
    return res.status(200).json({ success: true, message: "Slot updated successfully" });
  } catch (error) {
    console.error("UpdateSlot.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { UpdateSlot };
