require("dotenv").config()
const app = require("./src/app") 
const cookieParser = require("cookie-parser")
const connectToDB = require("./src/config/database")
const authRouter = require("./src/routes/auth.routes")

connectToDB();


app.listen(3000,()=>{
  console.log("Server is running on port 3000")
})