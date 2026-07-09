const ADMIN_PASSWORD = "BCSO2026";

function login() {
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (password === ADMIN_PASSWORD) {
        localStorage.setItem("bcso_admin", "true");
        window.location.href = "dashboard.html";
    } else {
        message.textContent = "Code administrateur incorrect.";
        message.style.color = "#ff4d4d";
    }
}

function lecture() {
    localStorage.setItem("bcso_admin", "false");
    window.location.href = "dashboard.html";
}

function estAdmin() {
    return localStorage.getItem("bcso_admin") === "true";
}

function deconnexion() {
    localStorage.removeItem("bcso_admin");
    window.location.href = "login.html";
}