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

/* =========================
   MOSTRAR PRODUCTOS
========================= */
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

/* =========================
   GUARDAR / ACTUALIZAR
========================= */
async function guardarProducto() {
    const id = document.getElementById("id").value;
    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value;
    const imagenInput = document.getElementById("imagen");

    let imagen = "";

    // VALIDACIONES
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

    // IMAGEN
    if (imagenInput.files.length > 0) {
        imagen = await convertirBase64(imagenInput.files[0]);
    } else if (id) {
        const existente = lista.find(p => p.id == id);
        imagen = existente ? existente.imagen : "";
    } else {
        alert("Debe subir una imagen");
        return;
    }

    // EDITAR
    if (id) {
        const index = lista.findIndex(p => p.id == id);

        if (index !== -1) {
            lista[index] = {
                id: Number(id),
                nombre,
                precio,
                stock,
                categoria,
                descripcion,
                imagen
            };
        }

    } else {
        // NUEVO
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

function editar(id) {
    console.log("CLICK EDITAR:", id);

    const p = lista.find(x => x.id == id);

    console.log("PRODUCTO ENCONTRADO:", p);

    if (!p) return;

    document.getElementById("id").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("descripcion").value = p.descripcion;

    document.getElementById("imagen").value = "";

    document.getElementById("formulario").scrollIntoView({ behavior: "smooth" });

    alert("Editando: " + p.nombre);
}

function eliminar(id) {
    if (!confirm("¿Eliminar producto?")) return;

    lista = lista.filter(p => p.id != id);

    localStorage.setItem("inventario", JSON.stringify(lista));
    mostrar(lista);
}

function filtrar(tipo) {
    let listaFiltrada = [...lista];

    const texto = busqueda.value.toLowerCase();

    listaFiltrada = listaFiltrada.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    );

    if (tipo === "bajo") {
        listaFiltrada = listaFiltrada.filter(p => p.stock < 5 && p.stock > 0);
    } else if (tipo === "sin") {
        listaFiltrada = listaFiltrada.filter(p => p.stock === 0);
    }

    mostrar(listaFiltrada);
}

function limpiarFormulario() {
    document.getElementById("id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("imagen").value = "";
}


mostrar(lista);

window.editar = editar;
window.eliminar = eliminar;
window.guardarProducto = guardarProducto;
window.filtrar = filtrar;