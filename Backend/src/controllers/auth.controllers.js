const userModel = require("../models/user.models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.models")
const { getTokenFromRequest } = require("../utils/getTokenFromRequest")

const COOKIE_NAME = "token"
const cookieOptions = {
  httpOnly: false,
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000
}

function signUserToken(user) {
  return jwt.sign(
    { id: String(user._id), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase()
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function userJSON(user) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email
  }
}

/**
 * @name registerUserController
 * @description Register a new user , expects username,email and password.
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body
  const usernameClean = String(username ?? "").trim()
  const emailNorm = normalizeEmail(email)

  if (!usernameClean || !emailNorm || !password) {
    return res.status(400).json({
      message: "please provide username , email and password"
    })
  }

  const emailMatch = new RegExp(`^${escapeRegex(emailNorm)}$`, "i")
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username: usernameClean }, { email: emailMatch }]
  })

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "Account already exist with this username and email"
    })
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await userModel.create({
    username: usernameClean,
    email: emailNorm,
    password: hash
  })

  const token = signUserToken(user)

  res.cookie(COOKIE_NAME, token, cookieOptions)

  res.status(201).json({
    message: "User Registered Successfully",
    token,
    user: userJSON(user)
  })
}

/**
 * @name loginUserController
 * @description login a user by entering the email and password.
 * @access Public
 */

async function loginUserController(req, res) {
  try {
    const { email, password } = req.body
    const emailNorm = normalizeEmail(email)

    if (!emailNorm || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      })
    }

    const user = await userModel.findOne({
      email: new RegExp(`^${escapeRegex(emailNorm)}$`, "i")
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const token = signUserToken(user)

    res.cookie(COOKIE_NAME, token, cookieOptions)

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: userJSON(user)
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" })
  }
}

/**
 * @name logoutUserController
 * @description Clear token from user cookies and add the token in blacklist.
 * @access public 
 */

async function logoutUserController(req, res) {
  const token = getTokenFromRequest(req)

  if (token) {
    await tokenBlacklistModel.create({ token })
  }

  res.clearCookie(COOKIE_NAME, { path: "/" })
  res.status(200).json({
    message: "User Logged out successfully"
  })
}

/**
 * @name getMeController
 * @description get the current logged in users details.
 * @access Private
 */

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  res.status(200).json({
    message: "User details fetched successfully",
    user: userJSON(user)
  })
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
}

