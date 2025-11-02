import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// =======================================================================
// ========================= FUNCIONES GLOBALES ============================
// =======================================================================

// Redirige a otra página (útil para el menú y los botones de Generos)
window.redirigir = function(nombre) {
    window.location.href = nombre;
}

// Controla el scroll del carrusel horizontal de productos/categorías
window.scrollCarrusel = function(id, direccion) {
    const carrusel = document.getElementById(id);
    const desplazamiento = 250;
    if (carrusel) {
        carrusel.scrollBy({ left: direccion * desplazamiento, behavior: "smooth" });
    }
}

// Cierra el modal de detalle del producto
window.cerrarModalProducto = function() {
    document.getElementById("modalProducto").style.display = "none";
}

// =======================================================================
// ========================= CONTROL DE NAVEGACIÓN (SPA) =================
// =======================================================================

function ocultarTodasLasSecciones() {
    // Se excluyen Login, Registro y secciones que ahora son archivos HTML separados
    const secciones = ["inicio", "Mi-Tienda", "Nosotros", "catalogo", "Contacto"];
    secciones.forEach(id => {
        const el = document.getElementById(id);
        // La sección "inicio" debe usar display: block, otras usan display: flex si tienen layout especial
        if (el) el.style.display = "none";
    });
}

function mostrarSeccion(seccionId) {
    ocultarTodasLasSecciones();
    const seccion = document.getElementById(seccionId);
    if (seccion) seccion.style.display = "block"; // o 'flex' si la sección tiene layout flex
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// =======================================================================
// ========================= LÓGICA DE SESIÓN (ÍCONOS) =====================
// =======================================================================

/**
 * Verifica si el usuario está logeado (usando la clave guardada por login.js)
 * y actualiza la visibilidad de los iconos en el Header.
 */
function actualizarEstadoSesion() {
    // La clave de sesión que guarda login.js es 'usuarioLogeado'
    const logeado = localStorage.getItem("usuarioLogeado");
    const btnLoginDiv = document.querySelector(".btn-login");
    const btnLogoutDiv = document.querySelector(".btn-logout");

    if (logeado === 'true') {
        // Logeado: Muestra Logout, Oculta Login
        if (btnLogoutDiv) btnLogoutDiv.style.display = "flex"; // Usar 'flex' para layout del header
        if (btnLoginDiv) btnLoginDiv.style.display = "none";
    } else {
        // No Logeado: Muestra Login, Oculta Logout
        if (btnLogoutDiv) btnLogoutDiv.style.display = "none";
        if (btnLoginDiv) btnLoginDiv.style.display = "flex";
    }
}

/**
 * Elimina la sesión y actualiza el Header.
 * Se llama desde el 'onclick' del botón de Cerrar Sesión.
 */
window.cerrarSesion = function() {
    // Elimina la clave que indica que el usuario está activo
    localStorage.removeItem("usuarioLogeado");
    localStorage.removeItem("nombreUsuario"); 
    
    // Opcional: Redirigir o simplemente recargar la página principal
    alert("Has cerrado sesión.");
    window.location.href = 'index.html'; // Redirige para asegurar que todo se limpie
}

// =======================================================================
// ========================= CONFIGURACIÓN DE GENEROS =======================
// =======================================================================

async function MostrarGeneros(){
    const generos = await HTTPS_Request.GetGeneros();
    const menu = document.getElementById("categoria-menu");

    if (!generos || !menu) return;

    menu.innerHTML = "";

    generos.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat.nombre;
        btn.onclick = () => {
            PERSISTENT_DATA.SelectedGenero(cat.id_genero);
            redirigir(`seccGeneric.html`);
        };
        menu.appendChild(btn);
    });
}


// =======================================================================
// ========================= LÓGICA DE PRODUCTOS Y DETALLE =================
// =======================================================================

// Datos estáticos para el modal de detalle
const caracteristicasPorId = {
    "201": ["Material: Algodón Pima", "Corte: Slim Fit", "Color: Negro/Blanco", "Estilo: Casual"],
    "202": ["Material: Poliéster", "Estilo: Trench Clásico", "Color: Beige", "Detalles: Cinto ajustable"],
    "203": ["Material: Franela", "Diseño: Estampado", "Talla: S, M, L", "Ideal para invierno"],
    "204": ["Material: Nylon", "Corte: Regular", "Capucha: Desmontable", "Impermeable"],
    "301": ["Material: Piqué", "Marca: Lacoste", "Corte: Regular Fit", "Color: Múltiples"],
    "302": ["Material: Algodón", "Corte: Oversize", "Diseño: Rayas", "Cuello: Redondo"],
    "303": ["Material: Algodón", "Estilo: Básico", "Talla: 4 a 12", "Fácil de lavar"],
    "304": ["Material: Piqué", "Marca: Coniglio", "Detalle: Logo bordado", "Ideal para verano"],
};

function setupModalDetalle() {
    const imagenesProductos = document.querySelectorAll(".item img");
    imagenesProductos.forEach(img => {
        img.addEventListener("click", () => {
            const contenedor = img.closest(".item");
            const botonCompraOriginal = contenedor.querySelector(".agregar-carrito");

            if (!botonCompraOriginal) return;

            const id = botonCompraOriginal.getAttribute("data-id");
            const nombre = botonCompraOriginal.getAttribute("data-nombre");
            const precio = botonCompraOriginal.getAttribute("data-precio");
            const imagen = botonCompraOriginal.getAttribute("data-imagen");
            
            // Llenar el modal
            document.getElementById("modalNombre").textContent = nombre;
            document.getElementById("modalPrecioNum").textContent = `${precio}`;
            document.getElementById("modalImagen").src = imagen;

            // Transferir data-attributes al botón de Añadir al Carrito del modal
            const btnModal = document.getElementById("btnComprarDesdeModal");
            if (btnModal) {
                btnModal.setAttribute("data-id", id);
                btnModal.setAttribute("data-nombre", nombre);
                btnModal.setAttribute("data-precio", precio);
                btnModal.setAttribute("data-imagen", imagen);
            }

            // Llenar las características
            const lista = document.getElementById("modalCaracteristicas");
            lista.innerHTML = "";
            const caracteristicas = caracteristicasPorId[id] || ["Sin información disponible"];
            caracteristicas.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                lista.appendChild(li);
            });

            document.getElementById("modalProducto").style.display = "flex";
        });
    });
}

// =======================================================================
// ========================= INICIALIZACIÓN (DOMContentLoaded) =============
// =======================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Inicialización del Carrusel principal (Hero)
    const images = document.querySelectorAll('.hero img');
    const leftArrow = document.querySelector('.arrow.left');
    const rightArrow = document.querySelector('.arrow.right');
    let current = 0;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        if (images.length > 0) {
            images[index].classList.add('active');
        }
    }

    if (rightArrow && leftArrow && images.length > 0) {
        rightArrow.addEventListener('click', () => {
            current = (current + 1) % images.length;
            showImage(current);
        });
        leftArrow.addEventListener('click', () => {
            current = (current - 1 + images.length) % images.length;
            showImage(current);
        });
        showImage(current);
    }
    
    // Ejecución de tareas iniciales
    MostrarGeneros();
    setupModalDetalle();
    
    // Inicialización de la navegación (muestra la sección de inicio)
    mostrarSeccion("inicio");
    
    // 🔥 ACTUALIZACIÓN DE ESTADO DE SESIÓN (Muestra Login o Logout)
    actualizarEstadoSesion();
});