const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "token is required to be added in blacklist"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d"
  }
}, {
  timestamps: true
})

const tokenBlacklistModel = mongoose.model("blacklistToken",blacklistTokenSchema)

module.exports = tokenBlacklistModel