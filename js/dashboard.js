document.addEventListener("DOMContentLoaded", () => {
  // Show username
  const username = localStorage.getItem("username");
  document.getElementById("username").textContent = username ?? "Guest";

  let allSurveys = [];

  // Fetch and store all surveys
  fetch("https://localhost:44363/API/Survey/GetAll")
    .then(response => response.json())
    .then(data => {
      if (data && data.Result && Array.isArray(data.Result)) {
        allSurveys = data.Result;
        renderSurveys(allSurveys); // Render all on load
      } else {
        renderSurveys([]); // Empty fallback
      }
    })
    .catch(error => {
      console.error("Error fetching surveys:", error);
      document.getElementById("surveyTableBody").innerHTML =
        "<tr><td colspan='6'>Server error. Unable to load surveys.</td></tr>";
    });

  // Tab click filter
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      // Activate clicked tab
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.textContent.trim();

      if (filter === "All") {
        renderSurveys(allSurveys);
      } else {
        const filtered = allSurveys.filter(survey =>
          survey.Status.toLowerCase() === filter.toLowerCase()
        );
        renderSurveys(filtered);
      }
    });
  });

  const logoutDiv = document.querySelector(".logout");
  if (logoutDiv) {
    logoutDiv.addEventListener("click", () => {
      localStorage.removeItem("username");
      window.location.href = "login.html";
    });
  }
});

// Render table function
function renderSurveys(surveys) {
  const tableBody = document.getElementById("surveyTableBody");
  tableBody.innerHTML = "";

  if (!surveys.length) {
    tableBody.innerHTML = "<tr><td colspan='6'>No surveys found.</td></tr>";
    return;
  }

  surveys.forEach(survey => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${survey.Title}</td>
      <td>${survey.Status}</td>
      <td>${survey.CreatedByUserName}</td>
      <td>${survey.ModifiedByUserName}</td>
      <td>${survey.Responses}</td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

