const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbConnect");
const authMiddleware = require("./middleware/auth");
require("dotenv").config();

// ── Multer Instances ──────────────────────────────────────────────────────────
const { gameUpload, profileUpload } = require("./multer/multer");

// ── Common APIs ───────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// edited
const { SendOtp } = require("./apis/common/sendOtp");
const { VerifyOtp } = require("./apis/common/verifyOtp");
// edited
// ── Public APIs ───────────────────────────────────────────────────────────────
const { GetGames } = require("./apis/user/GetGames");
const { GetGameDetails } = require("./apis/user/GetGameDetails");
const { GetSlots } = require("./apis/user/GetSlots");
const { GetSeats } = require("./apis/user/GetSeats");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User APIs ─────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { BookSeat } = require("./apis/user/BookSeat");
const { MyBookings } = require("./apis/user/MyBookings");
const { CancelBooking } = require("./apis/user/CancelBooking");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

// ── Admin APIs ────────────────────────────────────────────────────────────────
const { GetUsers } = require("./apis/admin/GetUsers");
const { UpdateUserStatus } = require("./apis/admin/UpdateUserStatus");
const { AddGame } = require("./apis/admin/AddGame");
const { UpdateGame } = require("./apis/admin/UpdateGame");
const { DeleteGame } = require("./apis/admin/DeleteGame");
const { GetAdminGames } = require("./apis/admin/GetGames");
const { AddSlot } = require("./apis/admin/AddSlot");
const { UpdateSlot } = require("./apis/admin/UpdateSlot");
const { DeleteSlot } = require("./apis/admin/DeleteSlot");
const { GetAdminSlots } = require("./apis/admin/GetSlots");
const { AddSeat } = require("./apis/admin/AddSeat");
const { UpdateSeat } = require("./apis/admin/UpdateSeat");
const { DeleteSeat } = require("./apis/admin/DeleteSeat");
const { GetAdminSeats } = require("./apis/admin/GetSeats");
const { GetBookings } = require("./apis/admin/GetBookings");
const { UpdateBooking } = require("./apis/admin/UpdateBooking");
const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminFeedbacks } = require("./apis/admin/GetFeedbacks");
const { DashboardStats } = require("./apis/admin/DashboardStats");

// ─────────────────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: [
    "https://gamezone-5c3r.vercel.app",
    "https://gamezone-5c3r-h9xobdbg8-i-am-manavs-projects.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://gamezone-iota-nine.vercel.app"
  ],
  credentials: true
}));
// ── Static File Serving ───────────────────────────────────────────────────────
app.use("/uploads/games", express.static("uploads/games"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

// ── DB Connect ────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────────────────
//  COMMON APIs
// ─────────────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);


// edited
app.post("/sendOtp", SendOtp);
app.post("/verifyOtp", VerifyOtp);
// edited
app.post("/changePassword", ChangePassword);

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC APIs (no auth required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/games", GetGames);
app.get("/games/:id", GetGameDetails);
app.get("/slots/:game_id", GetSlots);
app.get("/seats/:game_id", GetSeats);
app.get("/feedbacks", GetFeedbacks);

// ─────────────────────────────────────────────────────────────────────────────
//  USER APIs (JWT required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/user/profile", authMiddleware, GetProfile);
app.post("/user/updateProfile", authMiddleware, profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/bookSeat", authMiddleware, BookSeat);
app.get("/user/myBookings", authMiddleware, MyBookings);
app.post("/user/cancelBooking", authMiddleware, CancelBooking);
app.post("/user/genOrderId", authMiddleware, GenOrderId);
app.post("/user/verifyPayment", authMiddleware, VerifyPayment);
app.post("/user/addFeedback", authMiddleware, AddFeedback);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN APIs (JWT required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/admin/users", authMiddleware, GetUsers);
app.post("/admin/updateUserStatus", authMiddleware, UpdateUserStatus);
app.post("/admin/addGame", authMiddleware, gameUpload.single("image"), AddGame);
app.post("/admin/updateGame", authMiddleware, gameUpload.single("image"), UpdateGame);
app.get("/admin/deleteGame/:id", authMiddleware, DeleteGame);
app.get("/admin/games", authMiddleware, GetAdminGames);
app.post("/admin/addSlot", authMiddleware, AddSlot);
app.post("/admin/updateSlot", authMiddleware, UpdateSlot);
app.get("/admin/deleteSlot/:id", authMiddleware, DeleteSlot);
app.get("/admin/slots", authMiddleware, GetAdminSlots);
app.post("/admin/addSeat", authMiddleware, AddSeat);
app.post("/admin/updateSeat", authMiddleware, UpdateSeat);
app.get("/admin/deleteSeat/:id", authMiddleware, DeleteSeat);
app.get("/admin/seats", authMiddleware, GetAdminSeats);
app.get("/admin/bookings", authMiddleware, GetBookings);
app.post("/admin/updateBooking", authMiddleware, UpdateBooking);
app.get("/admin/payments", authMiddleware, GetPayments);
app.get("/admin/feedbacks", authMiddleware, GetAdminFeedbacks);
app.get("/admin/dashboardStats", authMiddleware, DashboardStats);

app.get("/", (req, res) => {
  res.send("Welcome to GameX Platform API!");
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Game Zone Reservation server started on PORT ${PORT}!`)
);
