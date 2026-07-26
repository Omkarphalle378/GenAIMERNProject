const app = require("../src/app");
const http = require("http");

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  console.log("Testing test server on port", port);

  try {
    const axios = require("axios");
    // Test route existence without auth header
    const res = await axios.post(`http://localhost:${port}/api/interview/quiz/generate`, { skill: "React" }, {
      validateStatus: () => true
    });
    console.log("STATUS CODE:", res.status);
    console.log("RESPONSE DATA:", res.data);
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    server.close();
  }
});
