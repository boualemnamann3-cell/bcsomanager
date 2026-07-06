function login() {
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const ADMIN_PASSWORD = "BCSO2026";

    if (password === ADMIN_PASSWORD) {
        localStorage.setItem("admin", "true");
        window.location.href = "dashboard.html";
    } else {
        message.textContent = "Code administrateur incorrect.";
        message.style.color = "red";
    }
}

function lecture() {
    localStorage.setItem("admin", "false");
    window.location.href = "dashboard.html";
}