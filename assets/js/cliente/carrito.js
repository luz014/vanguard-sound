let historial = JSON.parse(localStorage.getItem("historial")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorCarrito = document.getElementById("carrito");
const totalTexto = document.getElementById("total");

// 🟢 CONTADOR
function actualizarContador() {
    const contador = document.getElementById("contadorCarrito");
    if (!contador) return;

    let total = 0;
    carrito.forEach(p => total += p.cantidad);

    contador.textContent = total;
}

// 🟢 Agregar producto
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(p => p.id === id);

    if (existe) {
        if (existe.cantidad < producto.stock) {
            existe.cantidad++;
        } else {
            alert("No hay más stock disponible");
        }
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    actualizarContador();
}

// 💾 Guardar carrito
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ➕ aumentar
function sumar(id) {
    const producto = carrito.find(p => p.id === id);
    const original = productos.find(p => p.id === id);

    if (producto.cantidad < original.stock) {
        producto.cantidad++;
    }

    guardarCarrito();
    mostrarCarrito();
    actualizarContador();
}

// ➖ disminuir
function restar(id) {
    const producto = carrito.find(p => p.id === id);

    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        eliminar(id);
    }

    guardarCarrito();
    mostrarCarrito();
    actualizarContador();
}

// ❌ eliminar
function eliminar(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    mostrarCarrito();
    actualizarContador();
}

// 🛒 Mostrar carrito (para carrito.html)
function mostrarCarrito() {
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        contenedorCarrito.innerHTML += `
            <div class="card">
                <img src="${p.imagen}">
                <h3>${p.nombre}</h3>
                <p>${p.cantidad} x $${p.precio}</p>
                <p>Total: $${subtotal}</p>
            </div>
        `;
    });

    if (totalTexto) {
        totalTexto.textContent = "Total: $" + total.toFixed(2);
    }
}

// 🟢 CHECKOUT
function realizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    generarFactura();
}

// 🧾 FACTURA
function generarFactura() {
    const detalle = document.getElementById("detalleFactura");

    let total = 0;
    let html = "<ul>";

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;
        html += `<li>${p.nombre} - ${p.cantidad} x $${p.precio}</li>`;
    });

    const impuesto = total * 0.07;
    const totalNeto = total + impuesto;

    let deseaFinanciar = confirm("¿Desea pago fraccionado?");

    let meses = 1;
    let quincenas = 1;
    let pagoQuincenal = totalNeto;

    if (deseaFinanciar) {
        meses = parseInt(prompt("¿Cuántos meses?")) || 1;
        quincenas = meses * 2;
        pagoQuincenal = totalNeto / quincenas;
    }

    html += `
        </ul>
        <p>Total: $${total.toFixed(2)}</p>
        <p>ITBMS: $${impuesto.toFixed(2)}</p>
        <h3>Total Neto: $${totalNeto.toFixed(2)}</h3>
        ${
            deseaFinanciar
            ? `<p>Pago quincenal: $${pagoQuincenal.toFixed(2)}</p>`
            : `<p>Pago contado</p>`
        }
    `;

    detalle.innerHTML = html;

    document.getElementById("factura").style.display = "block";

    generarPDF();
}

// 📄 PDF
function generarPDF() {
    const factura = document.getElementById("factura");

    html2canvas(factura).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 0);
        pdf.save("factura.pdf");

        finalizarCompra();
    });
}

// 💾 HISTORIAL
function finalizarCompra() {
    let total = 0;

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
    });

    const impuesto = total * 0.07;
    const totalNeto = total + impuesto;

    const compra = {
        fecha: new Date().toLocaleString(),
        productos: [...carrito],
        total: totalNeto.toFixed(2) // 🔥 AQUÍ ESTÁ LA CLAVE
    };

    historial.push(compra);
    localStorage.setItem("historial", JSON.stringify(historial));

    carrito = [];
    guardarCarrito();
    actualizarContador();
}

// 🔗 NAVEGACIÓN
function irCarrito() {
    window.location.href = "carrito.html";
}

function volver() {
    window.location.href = "cliente.html";
}

function irHistorial() {
    window.location.href = "historial.html";
}



// 🔄 INICIO
actualizarContador();
mostrarCarrito();