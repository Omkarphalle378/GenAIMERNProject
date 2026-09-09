const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());



const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://hire-smart-three.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed for origin: " + origin));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

app.get("/", (req, res) => {
  res.send("🚀 HireSmartAI Backend is Running Successfully");
});

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const errorHandler = require("./middlewares/error.middleware");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.use(errorHandler);

module.exports = app;