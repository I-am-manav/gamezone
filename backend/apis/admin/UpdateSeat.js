const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateSeat(req, res) {
  try {
    const { id, seat_no, status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid seat ID is required" });
    const db = await connectDB();
    const updateFields = { updated_at: new Date() };
    if (seat_no) updateFields.seat_no = seat_no;
    if (status) updateFields.status = status;
    const result = await db.collection("seats").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Seat not found" });
    return res.status(200).json({ success: true, message: "Seat updated successfully" });
  } catch (error) {
    console.error("UpdateSeat.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { UpdateSeat };
