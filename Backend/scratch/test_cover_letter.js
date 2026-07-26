const app = require("../src/app");
const http = require("http");
const axios = require("axios");

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  console.log("Testing test server on port", port);

  try {
    const res = await axios.post(`http://localhost:${port}/api/interview/cover-letter/generate`, {
      roleTitle: "Full Stack Developer",
      targetCompany: "Google",
      jobDescription: "We are looking for a developer",
      resumeText: "Experienced engineer"
    }, {
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
