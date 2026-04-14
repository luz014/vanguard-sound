let lista = JSON.parse(localStorage.getItem("inventario")) || productos;

const contenedor = document.getElementById("listaProductos");
const busqueda = document.getElementById("busquedaInventario");
busqueda.addEventListener("input", () => filtrar("todos"));

function convertirBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 🟢 MOSTRAR
function mostrar(listaMostrar) {
    contenedor.innerHTML = "";

    listaMostrar.forEach(p => {

        let clase = "";
        if (p.stock === 0) clase = "sin-stock";
        else if (p.stock < 5) clase = "bajo-stock";

        contenedor.innerHTML += `
            <div class="card ${clase}">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <p>Precio: $${p.precio}</p>
                <p>Stock: ${p.stock}</p>
                <p>${p.categoria}</p>

                <button onclick="editar(${p.id})">Editar</button>
                <button onclick="eliminar(${p.id})">Eliminar</button>
            </div>
        `;
    });
}

// 💾 GUARDAR
async function guardarProducto() {
    const id = document.getElementById("id").value;
    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value;
    const imagenInput = document.getElementById("imagen");

    let imagen = "";

    // 🔴 VALIDACIONES
    if (!nombre || !categoria || !descripcion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (isNaN(precio) || precio <= 0) {
        alert("Precio inválido");
        return;
    }

    if (isNaN(stock) || stock < 0) {
        alert("Stock inválido");
        return;
    }

    // 🖼️ CONVERTIR IMAGEN
    if (imagenInput.files.length > 0) {
        imagen = await convertirBase64(imagenInput.files[0]);
    } else if (id) {
        // mantener imagen anterior al editar
        const existente = lista.find(p => p.id == id);
        imagen = existente.imagen;
    } else {
        alert("Debe subir una imagen");
        return;
    }

    if (id) {
        const index = lista.findIndex(p => p.id == id);

        lista[index] = {
            id: parseInt(id),
            nombre,
            precio,
            stock,
            categoria,
            descripcion,
            imagen
        };

    } else {
        const nuevo = {
            id: Date.now(),
            nombre,
            precio,
            stock,
            categoria,
            descripcion,
            imagen
        };

        lista.push(nuevo);
    }

    localStorage.setItem("inventario", JSON.stringify(lista));
    limpiarFormulario();
    mostrar(lista);
}

// ✏️ EDITAR
function editar(id) {
    const p = lista.find(p => p.id === id);

    document.getElementById("id").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("descripcion").value = p.descripcion;
    document.getElementById("imagen").value = p.imagen;
}

// ❌ ELIMINAR
function eliminar(id) {
    if (!confirm("¿Eliminar producto?")) return;

    lista = lista.filter(p => p.id !== id);
    localStorage.setItem("inventario", JSON.stringify(lista));
    mostrar(lista);
}

// 🔍 FILTROS
function filtrar(tipo) {
    let listaFiltrada = [...lista];

    // 🔍 búsqueda
    const texto = busqueda.value.toLowerCase();

    listaFiltrada = listaFiltrada.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    );

    // 📦 filtros
    if (tipo === "bajo") {
        listaFiltrada = listaFiltrada.filter(p => p.stock < 5 && p.stock > 0);
    } else if (tipo === "sin") {
        listaFiltrada = listaFiltrada.filter(p => p.stock === 0);
    }

    mostrar(listaFiltrada);
}

// 🧹 LIMPIAR
function limpiarFormulario() {
    document.getElementById("id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("imagen").value = "";
}

// inicial
mostrar(lista);