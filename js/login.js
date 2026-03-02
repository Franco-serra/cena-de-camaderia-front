document.addEventListener("DOMContentLoaded", () => {

    console.log("JS cargado");

    const API_URL = "https://cena-de-camaderia.onrender.com";
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Datos:", email, password);

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            console.log("Status:", response.status);

            const data = await response.json();
            console.log("Response:", data);

            if (!response.ok) {
                alert("Credenciales inválidas");
                return;
            }

            localStorage.setItem("token", data.token);
            window.location.href = "admin.html";

        } catch (error) {
            console.error("Error detectado:", error);
        }
    });

});