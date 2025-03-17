const express = require("express");
const axios = require("axios");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
app.use(cors());

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiBR7BvYP--YlPUrPe3QOwedNmdunyLJAuL1HgH437seowpU3T9BKcXfuB7mjI1zk8joRrXmfLfXVe/pub?output=csv";

async function fetchSheetData() {
  try {
    const response = await axios.get(GOOGLE_SHEET_CSV_URL);
    const rows = response.data.split("\n").map((row) => row.split(","));

    const headers = rows[0]; // First row as headers
    const jsonData = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index]; // Map each column
      });
      return obj;
    });

    return jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

app.get("/data", async (req, res) => {
  const data = await fetchSheetData();
  res.json({ data });
});

// ✅ Export the handler for serverless platforms
module.exports.handler = serverless(app);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
