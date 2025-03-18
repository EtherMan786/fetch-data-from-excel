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

async function fetchSheetData() {
  try {
    const response = await axiosAPI.get(GOOGLE_SHEET_CSV_URL);
    const rows = response.data.split("\n").map((row) => row.split(","));

    const headers = rows[0];
    const jsonData = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
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

// ✅ Correcting the router issue
// No need for app.use('/.netlify/functions/api', router);
app.use('/.netlify/functions/api', app);

// ✅ Export the handler for serverless platforms
module.exports.handler = serverlessApi(app);

// ✅ Remove the unnecessary app.listen for serverless

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
