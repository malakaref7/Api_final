document.addEventListener("DOMContentLoaded", () => {
  // Show username
  const username = localStorage.getItem("username");
  document.getElementById("username").textContent = username ?? "Guest";

  let allSurveys = [];
  let filteredSurveys = [];
  const rowsPerPage = 5;
  let currentPage = 1;

  // Fetch and store all surveys
  fetch("https://localhost:44363/API/Survey/GetAll")
    .then(response => response.json())
    .then(data => {
      if (data && data.Result && Array.isArray(data.Result)) {
        allSurveys = data.Result;
        filteredSurveys = [...allSurveys];
        renderSurveys();
        renderPagination();
      } else {
        renderSurveys([]);
      }
    })
    .catch(error => {
      console.error("Error fetching surveys:", error);
      document.getElementById("surveyTableBody").innerHTML =
        "<tr><td colspan='6'>Server error. Unable to load surveys.</td></tr>";
    });

  // filter
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      // Activate clicked tab
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.textContent.trim();
      currentPage = 1; // reset to first page

      if (filter === "All") {
        filteredSurveys = [...allSurveys];
      } else {
        filteredSurveys = allSurveys.filter(survey =>
          survey.Status.toLowerCase() === filter.toLowerCase()
        );
      }

      renderSurveys();
      renderPagination();
    });
  });

  // Logout
  const logoutDiv = document.querySelector(".logout");
  if (logoutDiv) {
    logoutDiv.addEventListener("click", () => {
      localStorage.removeItem("username");
      window.location.href = "index.html";
    });
  }

  // Render table with pagination
  function renderSurveys() {
    const tableBody = document.getElementById("surveyTableBody");
    tableBody.innerHTML = "";

    if (!filteredSurveys.length) {
      tableBody.innerHTML = "<tr><td colspan='6'>No surveys found.</td></tr>";
      return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginated = filteredSurveys.slice(start, end);

    paginated.forEach(survey => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${survey.Title}</td>
        <td>
          <div class="status-badge ${survey.Status.toLowerCase()}">${survey.Status}</div>
          <div class="status-dates">
            Expires at ${survey.ExpiryDate ? survey.ExpiryDate : "9/10/2025"}<br>
            Publish at ${survey.PublishDate ? survey.PublishDate : "8/10/2025"}
          </div>
        </td>
        <td>${survey.CreatedByUserName}</td>
        <td>${survey.ModifiedByUserName}</td>
        <td>${survey.Type}</td>
        <td>${survey.Language}</td>
        <td>${survey.Responses}</td>
        <td class="actions">
          <img src="images/download.png" title="Download">
          <img src="images/upload.png" title="Upload">
          <img src="images/view.png" title="View">
          <img src="images/edit.png" title="Edit">
          <img src="images/copy.png" title="Duplicate">
          <img src="images/delete.png" title="Delete">
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Render pagination buttons
  function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredSurveys.length / rowsPerPage);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = (i === currentPage) ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderSurveys();
        renderPagination();
      });
      paginationContainer.appendChild(btn);
    }
  }
});
