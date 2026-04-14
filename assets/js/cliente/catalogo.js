const catalogo = document.getElementById("catalogo");
const busqueda = document.getElementById("busqueda");
const categoria = document.getElementById("categoria");
const orden = document.getElementById("orden");

// 🟢 Mostrar productos
function mostrarProductos(lista) {
    catalogo.innerHTML = "";

    lista.forEach(p => {
        catalogo.innerHTML += `
            <div class="card">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <p>$${p.precio}</p>
                <p>Stock: ${p.stock}</p>
                <button onclick="agregarAlCarrito(${p.id})" ${p.stock === 0 ? "disabled" : ""}>
                    ${p.stock === 0 ? "Sin stock" : "Agregar"}
                </button>
            </div>
        `;
    });
}

// 🔍 Búsqueda + filtros + orden
function filtrar() {
    let lista = [...productos];

    const texto = busqueda.value.toLowerCase();
    lista = lista.filter(p => p.nombre.toLowerCase().includes(texto));

    if (categoria.value) {
        lista = lista.filter(p => p.categoria === categoria.value);
    }

    if (orden.value === "precio-asc") {
        lista.sort((a, b) => a.precio - b.precio);
    } else if (orden.value === "precio-desc") {
        lista.sort((a, b) => b.precio - a.precio);
    }

    mostrarProductos(lista);
}

function irCarrito() {
    window.location.href = "carrito.html";
}

function irHistorial() {
    window.location.href = "historial.html";
}

// eventos
busqueda.addEventListener("input", filtrar);
categoria.addEventListener("change", filtrar);
orden.addEventListener("change", filtrar);

// inicial
mostrarProductos(productos);