document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "https://cena-de-camaderia.onrender.com";
    const form = document.getElementById("rsvpForm");
    const mensaje = document.getElementById("mensaje");
    const checkbox = document.getElementById("bringGuest");
    const guestCount = document.getElementById("guestCount");

    guestCount.style.display = "none";

    checkbox.addEventListener("change", function () {
        guestCount.style.display = this.checked ? "block" : "none";
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("name").value;
        const apellido = document.getElementById("lastName").value;
        const bringsGuest = checkbox.checked;
        const guestNumber = bringsGuest
            ? parseInt(document.getElementById("guestNumber").value) || 0
            : 0;

        try {
            const controller = new AbortController();

const timeout = setTimeout(() => controller.abort(), 30000);

const response = await fetch(`${API_URL}/api/confirmaciones`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        nombre,
        apellido,
        llevaAcompanantes: bringsGuest,
        cantidadAcompanantes: guestNumber
    }),
    signal: controller.signal
});

clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok) {
                mensaje.style.color = "red";
                mensaje.textContent = data.mensaje || "Error al confirmar";
                return;
            }

            mensaje.style.color = "green";
            mensaje.textContent = "¡Confirmación enviada con éxito!";
            form.reset();
            guestCount.style.display = "none";

        } catch (error) {
            mensaje.style.color = "red";
            mensaje.textContent = "Error de conexión con el servidor";
        }
    });

});