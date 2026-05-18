const connectDB = require("../../db/dbConnect");
async function DashboardStats(req, res) {
  try {
    const db = await connectDB();
    const totalUsers = await db.collection("users").countDocuments({ role: "User" });
    const totalGames = await db.collection("games").countDocuments({});
    const activeGames = await db.collection("games").countDocuments({ status: "Active" });
    const totalSlots = await db.collection("game_slots").countDocuments({});
    const availableSlots = await db.collection("game_slots").countDocuments({ status: "Available" });
    const totalSeats = await db.collection("seats").countDocuments({});
    const availableSeats = await db.collection("seats").countDocuments({ status: "Available" });
    const totalBookings = await db.collection("bookings").countDocuments({});
    const activeBookings = await db.collection("bookings").countDocuments({ status: "Booked" });
    const cancelledBookings = await db.collection("bookings").countDocuments({ status: "Cancelled" });

    const revenueResult = await db.collection("payments").aggregate([{ $match: { status: "Success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const ratingResult = await db.collection("feedbacks").aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]).toArray();
    const avgRating = ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

    const recentBookings = await db.collection("bookings").aggregate([
      { $sort: { date: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "games", localField: "game_id", foreignField: "_id", as: "game" } },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
    ]).toArray();

    const recentPayments = await db.collection("payments").aggregate([
      { $sort: { date: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
    ]).toArray();

    return res.status(200).json({ success: true, message: "Dashboard stats fetched successfully", data: { totalUsers, totalGames, activeGames, totalSlots, availableSlots, totalSeats, availableSeats, totalBookings, activeBookings, cancelledBookings, totalRevenue, avgRating, recentBookings, recentPayments } });
  } catch (error) {
    console.error("DashboardStats.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { DashboardStats };
