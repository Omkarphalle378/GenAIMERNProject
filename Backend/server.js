require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is missing. Set it in Backend/.env")
  process.exit(1)
}

connectToDB();


app.listen(3000,()=>{
  console.log("Server is running on port 3000")
})