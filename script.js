const API_URL = "https://dining-page.netlify.app/.netlify/functions/api/data";

// Fetch and Display Menu Data
async function fetchMenuData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch menu data");

    const data = await response.json();
    console.log("Fetched Data:", data); // Debugging

    // Check if data is nested inside 'data'
    const menuData = Array.isArray(data) ? data : data.data;

    if (!Array.isArray(menuData)) {
      throw new Error("Invalid menu data format");
    }

    document.getElementById("loading").style.display = "none";
    displayData(menuData);
  } catch (error) {
    console.error("Error fetching menu data:", error);
    document.getElementById("loading").style.display = "none";
    document.getElementById("error").innerHTML = "<p>Failed to load menu.</p>";
  }
}

// Display Data in HTML
function displayData(menuData) {
  const container = document.getElementById("menu-container");
  container.innerHTML = ""; // Clear previous content

  if (!menuData || menuData.length === 0) {
    container.innerHTML = "<p>No menu data available.</p>";
    return;
  }

  menuData.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("menu-item");

    div.innerHTML = `
      <h3>${item["meal-name"] || "Unnamed Dish"}</h3>
      <p>${item["description"] || "No description available"}</p>
      <strong>Price: ${item["price1"] || "N/A"} ${item["currency"] || ""}</strong>
    `;

    container.appendChild(div);
  });
}

// Fetch Data on Page Load
fetchMenuData();
