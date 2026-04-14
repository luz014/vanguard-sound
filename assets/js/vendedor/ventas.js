let venta = JSON.parse(localStorage.getItem("venta")) || [];


const contenedorProductos = document.getElementById("productos");
const listaVenta = document.getElementById("listaVenta");
const totalVentaTexto = document.getElementById("totalVenta");
const busqueda = document.getElementById("busquedaVendedor");

// 🟢 Mostrar productos
function mostrarProductos(lista) {
    contenedorProductos.innerHTML = "";

    lista.forEach(p => {
        contenedorProductos.innerHTML += `
            <div class="card">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <p>$${p.precio}</p>
                <p>Stock: ${p.stock}</p>
                <button onclick="agregarVenta(${p.id})" ${p.stock === 0 ? "disabled" : ""}>
                    Agregar
                </button>
            </div>
        `;
    });
}

// 🔍 búsqueda rápida
busqueda.addEventListener("input", () => {
    const texto = busqueda.value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
});

// ➕ agregar a venta
function agregarVenta(id) {
    const producto = productos.find(p => p.id === id);
    const existe = venta.find(p => p.id === id);

    if (existe) {
        if (existe.cantidad < producto.stock) {
            existe.cantidad++;
        } else {
            alert("Stock insuficiente");
        }
    } else {
        venta.push({ ...producto, cantidad: 1 });
    }

    // ✅ GUARDAR DESPUÉS DE MODIFICAR
    localStorage.setItem("venta", JSON.stringify(venta));

    mostrarVenta();
}

// 🧾 mostrar venta
function mostrarVenta() {
    listaVenta.innerHTML = "";

    let total = 0;

    if (venta.length === 0) {
        listaVenta.innerHTML = "<p style='text-align:center;'>No hay productos en la venta</p>";
        totalVentaTexto.textContent = "";
        return;
    }

    venta.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        listaVenta.innerHTML += `
            <div class="card">
                <img src="${p.imagen}" style="width:80px;">
                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                <p>${p.cantidad} x $${p.precio}</p>
                <strong>$${subtotal}</strong>
            </div>
        `;
    });

    totalVentaTexto.textContent = "Total: $" + total.toFixed(2);
}

// ❌ cancelar venta
function cancelarVenta() {
    venta = [];
    localStorage.removeItem("venta");
    mostrarVenta();
}

// ✅ confirmar venta
function confirmarVenta() {
    if (venta.length === 0) {
        alert("No hay productos en la venta");
        return;
    }

    generarFactura();
}

// 🧾 factura
function generarFactura() {
    const detalle = document.getElementById("detalleFactura");

    let total = 0;
    let html = "<ul>";

    venta.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        html += `<li>${p.nombre} - ${p.cantidad} x $${p.precio} = $${subtotal}</li>`;
    });

    const impuesto = total * 0.07;
    const totalNeto = total + impuesto;

    // 💳 PAGO FRACCIONADO
  let deseaFinanciar = confirm("¿Desea pago fraccionado?");

let meses = 1;
let quincenas = 1;
let pagoQuincenal = totalNeto;

if (deseaFinanciar) {
    meses = parseInt(prompt("¿En cuántos meses desea pagar? (ej: 3, 6, 12)"));

    if (!meses || meses <= 0) {
        meses = 1;
    }

    quincenas = meses * 2;
    pagoQuincenal = totalNeto / quincenas;
}

    html += `
    </ul>
    <p>Total: $${total.toFixed(2)}</p>
    <p>ITBMS (7%): $${impuesto.toFixed(2)}</p>
    <h3>Total Neto: $${totalNeto.toFixed(2)}</h3>

    <hr>

    ${
        deseaFinanciar
        ? `
        <h3>Pago fraccionado</h3>
        <p>Meses: ${meses}</p>
        <p>Pagos quincenales: ${quincenas}</p>
        <p>Cada pago: $${pagoQuincenal.toFixed(2)}</p>
        `
        : `<h3>Pago contado</h3>`
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
        pdf.save("factura_venta.pdf");

        cancelarVenta();
    });
}

function irVenta() {
    window.location.href = "venta.html";
}

function volver() {
    window.location.href = "vendedor.html";
}

// inicial
mostrarProductos(productos);
mostrarVenta(); // 👈 ESTE TE FALTABA