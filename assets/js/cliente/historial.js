const contenedor = document.getElementById("historial");

let historial = JSON.parse(localStorage.getItem("historial")) || [];

function mostrarHistorial() {
    contenedor.innerHTML = "";

    if (historial.length === 0) {
        contenedor.innerHTML = "<p>No hay compras registradas</p>";
        return;
    }

    historial.forEach((compra, index) => {
        let html = `<div class="card"><h3>Compra #${index + 1}</h3><ul>`;

        compra.productos.forEach(p => {
            html += `<li>${p.nombre} x${p.cantidad} - $${p.precio}</li>`;
        });

        html += `
            </ul>
            <strong>Total: $${compra.total}</strong>
        </div>
        `;

        contenedor.innerHTML += html;
    });
}

function volver() {
    window.location.href = "cliente.html";
}

mostrarHistorial();