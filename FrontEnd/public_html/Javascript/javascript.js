import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// ============ UTILIDADES Y NAVEGACIÓN ============
window.redirigir = function(nombre) {
    window.location.href = nombre;
}

function regresarInicio() {
    mostrarSeccion("inicio");
}

// ============ CONTROL DE SECCIONES (SPA: Single Page Application) ============
function ocultarTodasLasSecciones() {
    const secciones = ["inicio", "Mi-Tienda", "Nosotros", "catalogo", "Contacto"];
    secciones.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

function mostrarSeccion(seccionId) {
    ocultarTodasLasSecciones();
    const seccion = document.getElementById(seccionId);
    if (seccion) seccion.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============ CONFIGURACION DE GENEROS ============
async function MostrarGeneros(){
    const generos = await HTTPS_Request.GetGeneros();

    if (!generos) return;

    const menu = document.getElementById("categoria-menu");

    if(!menu) return;

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

// ============ CARRUSEL HORIZONTAL DE PRODUCTOS ============
function scrollCarrusel(id, direccion) {
    const carrusel = document.getElementById(id);
    const desplazamiento = 250;
    if (carrusel) {
        carrusel.scrollBy({ left: direccion * desplazamiento, behavior: "smooth" });
    }
}




// ============ MODALES LOGIN / REGISTRO ============
function mostrarModalLogin() {
    document.getElementById("modalLogin").style.display = "flex";
    document.getElementById("modalRegistro").style.display = "none";
}

function cerrarModalLogin() {
    document.getElementById("modalLogin").style.display = "none";
}

function mostrarModalRegistro() {
    document.getElementById("modalLogin").style.display = "none";
    document.getElementById("modalRegistro").style.display = "flex";
}

function cerrarModalRegistro() {
    document.getElementById("modalRegistro").style.display = "none";
}

// ============ LÓGICA DE SESIÓN (SIMULADA CON localStorage) ============

function actualizarEstadoSesion() {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    const btnLoginDiv = document.querySelector(".btn-login");
    const btnLogoutDiv = document.querySelector(".btn-logout");

    if (usuarioActivo) {
        if (btnLogoutDiv) btnLogoutDiv.style.display = "block";
        if (btnLoginDiv) btnLoginDiv.style.display = "none";
    } else {
        if (btnLogoutDiv) btnLogoutDiv.style.display = "none";
        if (btnLoginDiv) btnLoginDiv.style.display = "block";
    }
}

function iniciarSesion() {
    const usuario = document.getElementById("loginUsuario").value;
    const clave = document.getElementById("loginClave").value;

    if (usuario && clave) {
        localStorage.setItem("usuarioActivo", usuario);
        cerrarModalLogin();
        actualizarEstadoSesion();
        alert(`Bienvenido, ${usuario}!`);
    } else {
        alert("Por favor, ingresa tu usuario y contraseña.");
    }
}

function registrarUsuario() {
    // 1. Obtener los valores de TODOS los campos
    const nombre = document.getElementById("registroUsuario").value; // Nombre Completo
    const apellido = document.getElementById("registroApellido").value; // Apellido Completo (Nuevo)
    const correo = document.getElementById("registroCorreo").value; // Correo Electrónico (Nuevo)
    const clave = document.getElementById("registroClave").value; // Contraseña 

    // 2. Validar que todos los campos estén llenos
    if (nombre && apellido && correo && clave) {
        // En un escenario real, aquí se enviarían los datos a un servidor.
        // Aquí solo simulamos el inicio de sesión con el nombre completo.
        
        // Puedes guardar el nombre completo para el saludo
        const nombreCompleto = `${nombre} ${apellido}`; 
        
        // Usamos el nombre completo como 'usuario activo' para la simulación
        localStorage.setItem("usuarioActivo", nombreCompleto); 
        
        cerrarModalRegistro();
        actualizarEstadoSesion();
        alert(`¡Registro exitoso! Bienvenido, ${nombreCompleto}. Tu correo es: ${correo}`);
    } else {
        alert("Por favor, completa todos los campos para registrarte: Nombre, Apellido, Correo y Contraseña.");
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    actualizarEstadoSesion();
    alert("Has cerrado sesión.");
}


// ============ LÓGICA DE PRODUCTOS Y MODAL DE DETALLE ============
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

// Variable global que puede ser usada por carrito.js si es necesario, 
// aunque la lógica de carrito ahora lee directamente de los data-attributes.
let productoActual = {}; 

function cerrarModalProducto() {
    document.getElementById("modalProducto").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    
    MostrarGeneros();
    // Lógica para abrir el modal de producto al hacer clic en la imagen
    const imagenesProductos = document.querySelectorAll(".item img");
    imagenesProductos.forEach(img => {
        img.addEventListener("click", () => {
            const contenedor = img.closest(".item");
            // Obtener el enlace/botón de compra que contiene los datos
            const botonCompraOriginal = contenedor.querySelector(".agregar-carrito");

            const id = botonCompraOriginal.getAttribute("data-id");
            const nombre = botonCompraOriginal.getAttribute("data-nombre");
            const precio = botonCompraOriginal.getAttribute("data-precio");
            const imagen = botonCompraOriginal.getAttribute("data-imagen");
            
            // Llenar el modal
            document.getElementById("modalNombre").textContent = nombre;
            document.getElementById("modalPrecioNum").textContent = `${precio}`;
            document.getElementById("modalImagen").src = imagen;

            // *** CORRECCIÓN CLAVE: Transferir data-attributes al botón del modal ***
            const btnModal = document.getElementById("btnComprarDesdeModal");
            if (btnModal) {
                btnModal.setAttribute("data-id", id);
                btnModal.setAttribute("data-nombre", nombre);
                btnModal.setAttribute("data-precio", precio);
                btnModal.setAttribute("data-imagen", imagen);
            }
            // ***********************************************************************

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
    
    // Inicialización al cargar la página
    mostrarSeccion("inicio");
    actualizarEstadoSesion();
});

// ============ Expose functions to global (for inline onclick attributes) ============
// HTML uses inline attributes like onclick="iniciarSesion()" which run in the global scope.
// Because this file is an ES module, functions are module-scoped; we must attach them to window.
window.mostrarModalLogin = mostrarModalLogin;
window.cerrarModalLogin = cerrarModalLogin;
window.mostrarModalRegistro = mostrarModalRegistro;
window.cerrarModalRegistro = cerrarModalRegistro;
window.iniciarSesion = iniciarSesion;
window.registrarUsuario = registrarUsuario;
window.cerrarSesion = cerrarSesion;
window.cerrarModalProducto = cerrarModalProducto;
window.redirigir = redirigir;
window.scrollCarrusel = scrollCarrusel;

// ============ Re-initialize hero carousel when DOM is ready ============
document.addEventListener('DOMContentLoaded', () => {
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
});