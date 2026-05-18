const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateGame(req, res) {
  try {
    const { id, name, description, status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid game ID is required" });
    const db = await connectDB();
    const updateFields = { updated_at: new Date() };
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;
    if (req.file) updateFields.image = `/uploads/games/${req.file.filename}`;
    const result = await db.collection("games").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Game not found" });
    return res.status(200).json({ success: true, message: "Game updated successfully" });
  } catch (error) {
    console.error("UpdateGame.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { UpdateGame };
