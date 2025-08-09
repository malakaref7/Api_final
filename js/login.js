document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); 

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("error");

  errorEl.textContent = "";

  // Make POST request 
  fetch("https://localhost:44363/API/User/Login", { 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Username: username,
      Password: password
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.Result) {
        alert("Login successful!");
        const username = data.Result.Username;
        localStorage.setItem("username", username); 
        window.location.href = "dashboard.html";
      } else if (data && data.Error) {
        errorEl.textContent = data.Error.Message || "Login failed.";
      } else {
        errorEl.textContent = "Unexpected response from server.";
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      errorEl.textContent = "Server error. Please try again.";
    });
});

// show password
document.getElementById("togglePass").addEventListener("click", function () {
  const passwordField = document.getElementById("password");
  if (passwordField.type === "password") {
    passwordField.type = "text";
    this.textContent = "Hide";
  } else {
    passwordField.type = "password";
    this.textContent = "Show";
  }
});
