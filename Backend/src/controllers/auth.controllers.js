const userModel = require("../models/user.models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.models")

/**
 * @name registerUserController
 * @description Register a new user , expects username,email and password.
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "please provide username , email and password"
    })
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }]
  })

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "Account already exist with this username and email"
    })
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await userModel.create({
    username,
    email,
    password: hash
  })

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.cookie("token", token)

  res.status(201).json({
    message: "User Registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
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

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      })
    }

    const user = await userModel.findOne({ email })

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

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
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
  const token = req.cookies.token

  if (token) {
    await tokenBlacklistModel.create({ token })
  }

  res.clearCookie("token")
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

  res.status(201).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
}

