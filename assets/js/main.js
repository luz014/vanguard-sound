function irModulo(modulo) {
    if (modulo === "cliente") {
        window.location.href = "pages/cliente.html";
    } else if (modulo === "vendedor") {
        window.location.href = "pages/vendedor.html";
    } else if (modulo === "inventario") {
        window.location.href = "pages/inventario.html";
    }
}