const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

// Sample API route
router.get("/data", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use("/api", router);

// ✅ Export handler for AWS Lambda
module.exports.handler = serverless(app);

  