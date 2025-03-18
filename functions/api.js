const expressAPI = require("express");
const axiosAPI = require("axios");
const corsAPI = require("cors");
const serverlessApi = require("serverless-http");
const bodyParserAPI = require('body-parser');

const app = expressAPI();
app.use(corsAPI());
app.use(bodyParserAPI.urlencoded({ extended: true }));
app.use(bodyParserAPI.json());

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiBR7BvYP--YlPUrPe3QOwedNmdunyLJAuL1HgH437seowpU3T9BKcXfuB7mjI1zk8joRrXmfLfXVe/pub?output=csv";

// ✅ Fetch and Parse Google Sheet Data
async function fetchSheetData() {
  try {
    const response = await axiosAPI.get(GOOGLE_SHEET_CSV_URL);
    const rows = response.data.split("\n").map((row) => row.split(","));

    const headers = rows[0].map(header => header.trim());
    const jsonData = rows.slice(1).map((row, rowIndex) => {
      // ✅ Ensure row length matches header length
      if (row.length !== headers.length) {
        console.warn(`Skipping row ${rowIndex + 1} due to column mismatch.`);
        return null;
      }

      let obj = {};
      headers.forEach((header, index) => {
        // ✅ Prevent __proto__ conflicts by renaming to _proto_
        const cleanHeader = header === '__proto__' ? '_proto_' : header;
        obj[cleanHeader] = row[index]?.trim() || null;
      });
      return obj;
    }).filter(Boolean); // Remove invalid rows

    return JSON.parse(JSON.stringify(jsonData)); // Remove potential cyclic references
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// ✅ API Route
app.get("/data", async (req, res) => {
  const data = await fetchSheetData();
  res.json({ data });
});

// ✅ Netlify serverless configuration
const router = expressAPI.Router();
router.use("/", app);

app.use('/.netlify/functions/api', router);
module.exports.handler = serverlessApi(app);

// ✅ Local Development Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
