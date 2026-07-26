const axios = require("axios");

async function testLogin() {
  try {
    console.log("Testing POST http://localhost:3000/api/auth/login...");
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      email: "admin@gmail.com",
      password: "admin"
    }, {
      validateStatus: () => true
    });
    console.log("STATUS CODE:", res.status);
    console.log("RESPONSE DATA:", res.data);
  } catch (err) {
    console.error("LOGIN REQUEST ERROR:", err.message);
  }
}

testLogin();
