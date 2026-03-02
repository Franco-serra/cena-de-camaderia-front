document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    const API_URL = "https://cena-de-camaderia.onrender.com";

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    async function fetchAuth(endpoint, options = {}) {
        return fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });
    }

    async function checkAuth() {
        const res = await fetchAuth("/api/admin/check");

        if (!res.ok) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    }

    async function cargarDashboard() {

        const res = await fetchAuth("/api/confirmaciones");
        const data = await res.json();

        renderTabla(data);

        document.getElementById("totalConfirmados").innerText =
            "Confirmados: " + data.length;

        document.getElementById("totalAcompanantes").innerText =
            "Acompañantes: " +
            data.reduce((a, b) => a + b.cantidadAcompanantes, 0);

        document.getElementById("totalPersonas").innerText =
            "Total personas: " +
            data.reduce((a, b) => a + (1 + b.cantidadAcompanantes), 0);
    }

    function renderTabla(data) {
        const tbody = document.getElementById("tablaConfirmaciones");

        tbody.innerHTML = data.map(c => `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.llevaAcompanantes ? "Sí" : "No"}</td>
                <td>${c.cantidadAcompanantes}</td>
                <td>
                    <button onclick="eliminarConfirmacion('${c._id}')">❌</button>
                </td>
            </tr>
        `).join("");
    }

    window.eliminarConfirmacion = async function(id) {
        await fetchAuth(`/api/confirmaciones/${id}`, {
            method: "DELETE"
        });

        cargarDashboard();
    };

    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", async () => {

        const apellido = searchInput.value;

        const res = await fetchAuth(`/api/confirmaciones?apellido=${apellido}`);
        const data = await res.json();

        renderTabla(data);
    });

    await checkAuth();
    await cargarDashboard();

    document.getElementById("logoutBtn").onclick = () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    };

});