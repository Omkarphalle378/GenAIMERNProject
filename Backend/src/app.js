const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());



app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
  ],
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