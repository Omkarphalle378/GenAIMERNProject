const {Router} = require('express')
const authController = require("../controllers/auth.controllers")
const authMiddleware = require("../middlewares/auth.middleware")
const authRouter = Router()


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Logged in user by using email and password
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route POST /api/auth/logout
 * @description Clear token from user cookies and add token to blacklist
 * @access Private
 */
authRouter.post("/logout", authMiddleware.authUser, authController.logoutUserController)
authRouter.get("/logout", authMiddleware.authUser, authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user
 * @access Private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
module.exports = authRouter;