import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// =======================================================================
// ========================= FUNCIONES GLOBALES ============================
// =======================================================================

// Redirige a otra página (útil para el menú y los botones de Generos)
// Exportada globalmente (window.) para ser usada en los onclick del HTML
window.redirigir = function (nombre) {
    window.location.href = nombre;
}

// Controla el scroll del carrusel horizontal de productos/categorías
window.scrollCarrusel = function (id, direccion) {
    const carrusel = document.getElementById(id);
    const desplazamiento = 250;
    if (carrusel) {
        carrusel.scrollBy({ left: direccion * desplazamiento, behavior: "smooth" });
    }
}

// Cierra el modal de detalle del producto
window.cerrarModalProducto = function () {
    // Necesitas asegurar que el modalProducto exista en tu index.html o esté siendo importado.
    const modal = document.getElementById("modalProducto");
    if (modal) {
        modal.style.display = "none";
    }
}

// =======================================================================
// ========================= LÓGICA DE SESIÓN (HEADER) =====================
// =======================================================================

/**
 * Verifica si el usuario está logeado y actualiza el header para
 * mostrar el nombre y el botón de Administrador si aplica.
 */
function actualizarEstadoSesion() {
    // 1. Obtener los elementos del Header
    const contenedorAnonimo = document.getElementById('contenedor-anonimo');
    const contenedorLogueado = document.getElementById('contenedor-logueado');
    const nombreUsuarioSpan = document.getElementById('nombre-usuario');
    const btnAdmin = document.getElementById('btn-admin');

    // 2. Obtener datos de LocalStorage
    // CLAVE: Esto asegura que el nombre se muestra tras un login exitoso
    const logeado = PERSISTENT_DATA.GetUsuarioLogeado() === 'true';
    const nombre = PERSISTENT_DATA.GetNombreUsuario() || 'Usuario';
    const rol = PERSISTENT_DATA.GetRol() || 'usuario';

    if (logeado) {
        // Usuario logueado: Ocultar anónimo, mostrar logueado
        if (contenedorAnonimo) contenedorAnonimo.style.display = 'none';
        // Usamos 'flex' para alinear los íconos (el valor original es 'block' o 'flex')
        if (contenedorLogueado) contenedorLogueado.style.display = 'flex';

        // Mostrar nombre en el span
        if (nombreUsuarioSpan) {
            nombreUsuarioSpan.textContent = `Hola, ${nombre}`;
        }

        // Mostrar/Ocultar botón de Administrador
        if (btnAdmin) {
            if (rol === 'admin') {
                btnAdmin.style.display = 'block';
            } else {
                btnAdmin.style.display = 'none';
            }
        }
    } else {
        // Usuario anónimo: Mostrar anónimo, ocultar logueado
        if (contenedorAnonimo) contenedorAnonimo.style.display = 'flex'; // Usamos 'flex' por el layout
        if (contenedorLogueado) contenedorLogueado.style.display = 'none';
    }
}

/**
 * Elimina la sesión (usuarioLogeado, nombreUsuario, rolUsuario) y recarga.
 * Se llama desde el 'onclick' del botón de Cerrar Sesión.
 */
window.cerrarSesion = function () {
    // Elimina todas las claves de sesión importantes

    PERSISTENT_DATA.SetNombreUsuario('');
    PERSISTENT_DATA.SetTokenData('');
    PERSISTENT_DATA.SetUsuarioLogeado('false');
    PERSISTENT_DATA.SetRol('');

    // Redirige a la página principal para asegurar que el header se actualice
    // y para salir de la página de Admin/Perfil si el usuario estaba allí.
    window.location.href = 'index.html';
}

// =======================================================================
// ========================= CONFIGURACIÓN DE GENEROS =======================
// =======================================================================

async function MostrarGeneros() {
    // *Asegúrate de que la función GetGeneros() está definida y exportada en HTTPRequest.js*
    const generos = await HTTPS_Request.GetGeneros();
    const menu = document.getElementById("categoria-menu");

    if (!generos || !menu) return;

    // Limpia los botones de géneros estáticos del HTML
    menu.innerHTML = "";

    // Agrega los géneros dinámicos (asumiendo que cat.nombre y cat.id_genero existen)
    generos.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat.nombre;
        btn.onclick = () => {
            // *Asegúrate de que la función SelectedGenero() está definida y exportada en PersistentData.js*
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
    // Esta función asume que tienes el HTML del modal en algún lugar de tu index.html
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
            // Usar toFixed(2) para el formato de moneda si es necesario
            document.getElementById("modalPrecioNum").textContent = `${parseFloat(precio).toFixed(2)}`;
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
            if (lista) {
                lista.innerHTML = "";
                const caracteristicas = caracteristicasPorId[id] || ["Sin información disponible"];
                caracteristicas.forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    lista.appendChild(li);
                });
            }

            const modal = document.getElementById("modalProducto");
            if (modal) {
                modal.style.display = "flex";
            }
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

    // 🔥 FUNCIÓN CLAVE: ACTUALIZACIÓN DE ESTADO DE SESIÓN 
    // Esto se ejecuta en cada carga de página para mostrar/ocultar el nombre y el botón de admin
    actualizarEstadoSesion();
});


// Mostrar u ocultar el menú del usuario al hacer clic en el botón
document.addEventListener("DOMContentLoaded", () => {
    const btnUsuario = document.getElementById("nombre-usuario");
    const menuUsuario = document.querySelector(".usuario-menu");

    if (btnUsuario && menuUsuario) {
        btnUsuario.addEventListener("click", () => {
            menuUsuario.classList.toggle("activo");
        });
    }

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".usuario-dropdown")) {
            if (menuUsuario) menuUsuario.classList.remove("activo");
        }
    });
});





// Esperar a que el DOM cargue los botones de color/talla
document.addEventListener("DOMContentLoaded", () => {

    // Listener para colores
    document.querySelectorAll(".color-option").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".color-option").forEach(b => b.classList.remove("color-seleccionado"));
            this.classList.add("color-seleccionado");
        });
    });

    // Listener para tallas
    document.querySelectorAll(".talla-option").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".talla-option").forEach(b => b.classList.remove("talla-seleccionada"));
            this.classList.add("talla-seleccionada");
        });
    });

});

// =======================================================================
// ========================= LÓGICA DEL MODAL DE COMPRA ====================
// =======================================================================

function obtenerSeleccionProducto() {
    const colorSeleccionado = document.querySelector(".color-option.color-seleccionado");
    const tallaSeleccionada = document.querySelector(".talla-option.talla-seleccionada");

    // NOTA: El ID de producto base debe venir del data-id del botón en el modal, no de un input.
    return {
        // id_unico: document.getElementById("id_unico_producto")?.value, // Esto está mal si no existe el input
        color_unico: colorSeleccionado ? colorSeleccionado.dataset.color : null,
        talla_unico: tallaSeleccionada ? tallaSeleccionada.dataset.talla : null
    };
}
window.obtenerSeleccionProducto = obtenerSeleccionProducto;


document.getElementById("btnComprarDesdeModal")?.addEventListener("click", (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del botón

    const info = obtenerSeleccionProducto(); // Obtener color y talla

    // Validar que se haya seleccionado color y talla
    if (!info.color_unico || !info.talla_unico) {
        alert("Selecciona color y talla antes de continuar.");
        return;
    }

    const btnModal = e.currentTarget;
    const idProductoBase = btnModal.getAttribute("data-id");

    if (!idProductoBase) {
        console.error("Error: ID base del producto no encontrado en el botón del modal.");
        alert("Error al cargar la información del producto.");
        return;
    }

    // Generar el ID ÚNICO de la VARIANTE (SKU)
    // Se recomienda una función de normalización, pero usaremos mayúsculas directas aquí por simplicidad.
    const colorNormalizado = info.color_unico.toUpperCase();
    const tallaNormalizada = info.talla_unico.toUpperCase();
    const varianteId = `${idProductoBase}-${colorNormalizado}-${tallaNormalizada}`;


    // Crear el objeto de producto listo para carrito.js
    const infoProducto = {
        imagen: btnModal.getAttribute("data-imagen"),
        nombre: btnModal.getAttribute("data-nombre"),
        precio: btnModal.getAttribute("data-precio"),

        // 🔥 CLAVE: Usamos el ID de la VARIANTE para que carrito.js agrupe correctamente
        id_unico: varianteId,
        
        // Pasamos los valores de variante seleccionados
        color: info.color_unico,
        talla: info.talla_unico,
        cantidad: 1 // Por defecto 1 desde el modal, a menos que tengas un input de cantidad
    };

    // 🔥 CLAVE: Disparar el CustomEvent que espera carrito.js
    const eventoCarrito = new CustomEvent("agregar-variante", {
        bubbles: true,
        detail: { producto: infoProducto }
    });

    // Disparamos el evento a nivel del documento
    document.body.dispatchEvent(eventoCarrito);
    
    // Opcional: Cerrar el modal inmediatamente después de disparar el evento
    window.cerrarModalProducto();

    // Opcional: Forzar la actualización del contador (si carrito.js no lo hace al capturar el evento)
    if (typeof window.actualizarContadorCarrito === 'function') {
        window.actualizarContadorCarrito();
    }
});