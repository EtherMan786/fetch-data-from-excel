const API_URL = "https://miniature-space-bassoon-4x7xq5j7vvv35g4-5000.app.github.dev/data";

// Fetch and Display Menu Data
async function fetchMenuData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch menu data");

    const data = await response.json();
    console.log("Fetched Data:", data); // Debugging

    displayData(data);
  } catch (error) {
    console.error("Error fetching menu data:", error);
    document.getElementById("menu").innerHTML = "<p>Failed to load menu.</p>";
  }
}

// Display Data in HTML
function displayData(menuData) {
  const container = document.getElementById("menu");
  container.innerHTML = ""; // Clear previous content

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
