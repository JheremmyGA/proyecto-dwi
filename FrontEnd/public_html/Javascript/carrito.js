// ============ Variables Globales ============
const listaCarrito = document.querySelector("#lista-carrito tbody");
// Estos elementos existen en carrito.html
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const btnCheckout = document.getElementById('img-carrito');

// Nuevo elemento para el contador en el header (debe existir en index.html y otras páginas)
const contadorCarrito = document.getElementById('contador-carrito');

let articulosCarrito = [];

// Modales de Pago
const modalPago = document.getElementById('modal-pago');
const cerrarModalPago = document.getElementById('cerrar-modal');
const formularioPago = document.getElementById('formulario-pago');


// ============ FUNCIONES DE PERSISTENCIA ============

function guardarCarrito() {
    localStorage.setItem('articulosCarrito', JSON.stringify(articulosCarrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('articulosCarrito');
    articulosCarrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// ============ FUNCIONES DE CONTADOR ============

function actualizarContadorCarrito() {
    if (!contadorCarrito) return;

    const totalProductosUnicos = articulosCarrito.length;

    if (totalProductosUnicos > 0) {
        contadorCarrito.textContent = totalProductosUnicos;
        contadorCarrito.style.display = 'block';
    } else {
        contadorCarrito.textContent = 0;
        contadorCarrito.style.display = 'none';
    }
}

// ============ FUNCIONES DE NORMALIZACIÓN ============

/**
 * Función auxiliar para normalizar ID, Color y Talla (quita espacios y pone en mayúsculas).
 */
const normalizar = (valor) => valor ? String(valor).trim().toUpperCase() : '';


// ============ Funciones del Carrito ============
/**
 * Agrega un producto al carrito, manejando CustomEvents y clicks del catálogo.
 */
function agregarProductoAlCarrito(e) {
    // 0. Seguridad: Asegura que el carrito esté cargado al inicio
    if (typeof cargarCarrito === 'function') {
        cargarCarrito();
    }

    let infoProducto = {};

    // 1. Obtener info del producto (Prioridad al CustomEvent de detalle_producto_prenda.js)
    if (e.detail && e.detail.producto) {
        // CAMINO A: El producto viene de la página de detalle (CustomEvent)
        infoProducto = e.detail.producto; 

    } else {
        // CAMINO B: El producto viene del catálogo (Evento de click normal)

        // CORRECCIÓN: Si no es CustomEvent, validamos que sea un botón de AGREGAR
        if (!e.target || (!e.target.classList.contains('agregar-carrito') && e.target.id !== 'agregarCarrito')) {
            return; // No es el elemento que buscamos, detener la ejecución.
        }

        // Si es un click, prevenimos el comportamiento por defecto
        e.preventDefault();

        const btn = e.target;
        infoProducto = {
            imagen: btn.getAttribute("data-imagen"),
            nombre: btn.getAttribute("data-nombre"),
            precio: btn.getAttribute("data-precio"),
            id_unico: btn.getAttribute("data-id"), // ID de la variante (SKU)
            color: btn.getAttribute("data-color"),
            talla: btn.getAttribute("data-talla"),
            cantidad: parseInt(btn.getAttribute("data-cantidad")) || 1
        };
    }

    // 2. Normalización de Precio 
    const precioLimpio = String(infoProducto.precio).replace('S/.', '').trim();
    infoProducto.precio = parseFloat(precioLimpio);

    // 3. Normalizar el ID de la variante para la búsqueda
    const idUnicoNormalizado = normalizar(infoProducto.id_unico);

    // Normalizar Color y Talla
    infoProducto.color_unico = normalizar(infoProducto.color);
    infoProducto.talla_unico = normalizar(infoProducto.talla);

    // 4. Validar
    if (!idUnicoNormalizado || !infoProducto.nombre || isNaN(infoProducto.precio)) {
        console.error("Error: Datos incompletos o ID Único no disponible.", infoProducto);
        return;
    }

    // 5. Estandarizar el Nombre (UI)
    const nombreBase = infoProducto.nombre.split(' - ')[0];
    infoProducto.nombre = `${nombreBase.trim()} - ${infoProducto.color_unico} (${infoProducto.talla_unico})`;

    // 6. VALIDACIÓN POR ID (Agrupación por ID único)
    let existe = articulosCarrito.find(producto =>
        producto.id_unico === idUnicoNormalizado
    );

    // 7. Actualizar el producto a agregar con el ID normalizado
    infoProducto.id_unico = idUnicoNormalizado;

    // 8. Lógica de adición/actualización
    if (existe) {
        existe.cantidad += infoProducto.cantidad;
        existe.subtotal = existe.cantidad * existe.precio;
    } else {
        infoProducto.subtotal = infoProducto.precio * infoProducto.cantidad;
        articulosCarrito.push(infoProducto);
    }

    // 9. Guardar y actualizar UI
    localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
    carritoHTML();
    actualizarContadorCarrito();

    alert(`"${infoProducto.nombre}" agregado al carrito.`);
}


/**
 * Elimina un producto del carrito (por ID, Color y Talla).
 */
function eliminarProducto(e) {
    if (e.target.classList.contains("eliminar-producto") ||
        e.target.classList.contains("borrar-curso")) {

        e.preventDefault();

        // Normalizar los data-attributes leídos
        const productoIdUnico = normalizar(e.target.getAttribute('data-id'));
        const colorUnico = normalizar(e.target.getAttribute('data-color'));
        const tallaUnico = normalizar(e.target.getAttribute('data-talla'));

        // Filtrar por la combinación única NORMALIZADA
        articulosCarrito = articulosCarrito.filter(
            articulo => !(articulo.id_unico === productoIdUnico && articulo.color_unico === colorUnico && articulo.talla_unico === tallaUnico)
        );

        guardarCarrito();
        carritoHTML();
        actualizarContadorCarrito();
    }
}


/**
 * Actualiza la cantidad de un artículo (por ID, Color y Talla) y recalcula.
 */
function actualizarCantidad(e) {
    if (e.target.classList.contains('cantidad-producto')) {
        const input = e.target;

        // Normalizar los data-attributes leídos
        const productoIdUnico = normalizar(input.getAttribute('data-id'));
        const colorUnico = normalizar(input.getAttribute('data-color'));
        const tallaUnico = normalizar(input.getAttribute('data-talla'));

        let nuevaCantidad = parseInt(input.value);

        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
            nuevaCantidad = 1;
            input.value = 1;
        }

        articulosCarrito = articulosCarrito.map(articulo => {
            // Condición de actualización por ID, Color y Talla NORMALIZADOS
            if (articulo.id_unico === productoIdUnico && articulo.color_unico === colorUnico && articulo.talla_unico === tallaUnico) {
                articulo.cantidad = nuevaCantidad;
            }
            return articulo;
        });

        guardarCarrito();
        carritoHTML();
        actualizarContadorCarrito();
    }
}


/**
 * Genera el HTML del carrito basándose en el array articulosCarrito.
 */
function carritoHTML() {
    if (!listaCarrito) return;

    vaciarCarritoDOM();

    let totalCompra = 0;

    articulosCarrito.forEach(articulo => {
        const precioUnitario = parseFloat(String(articulo.precio).replace('S/. ', '').trim());

        if (isNaN(precioUnitario)) {
            return;
        }

        // Estas líneas de console.log son muy útiles para la depuración
        console.log("Producto en carrito:");
        console.log("ID:", articulo.id_unico);
        console.log("Color:", articulo.color_unico);
        console.log("Talla:", articulo.talla_unico);
        console.log("Precio:", articulo.precio);


        const subtotal = (precioUnitario * articulo.cantidad).toFixed(2);
        totalCompra += parseFloat(subtotal);

        // Texto para Color y Talla (usamos los valores originales para la visualización)
        const variaciones = [articulo.color, articulo.talla].filter(v => v).join(' / ');


        const row = document.createElement('tr');
        row.setAttribute("data-id", articulo.id); // Este atributo puede ser removido si solo usamos id_unico
        row.innerHTML = `
    <td><img src="${articulo.imagen}" width="80" height="60" style="object-fit: cover;"></td>
    <td>
        ${articulo.nombre}
        ${variaciones ? `<br><small>(${variaciones})</small>` : ''}
    </td>
    <td class="precio-subtotal">S/. ${subtotal}</td>
    <td>
        <input 
            type="number" 
            min="1" 
            value="${articulo.cantidad}" 
            class="cantidad-producto" 
            data-id="${articulo.id_unico}" 
            data-color="${articulo.color_unico || ''}"
            data-talla="${articulo.talla_unico || ''}"
            style="width: 60px; text-align: center;"
        >
    </td>
    <td>
        <a href="#" class="eliminar-producto" 
            data-id="${articulo.id_unico}" 
            data-color="${articulo.color_unico || ''}"
            data-talla="${articulo.talla_unico || ''}">X
        </a>
    </td>
`;

        listaCarrito.appendChild(row);
    });

    const totalFinalElement = document.getElementById('total-final');
    if (totalFinalElement) {
        totalFinalElement.textContent = `S/. ${totalCompra.toFixed(2)}`;
    }
}

/**
 * Vacía el contenido del carrito en el DOM.
 */
function vaciarCarritoDOM() {
    while (listaCarrito && listaCarrito.firstChild) {
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}

/**
 * Vacía el array de artículos y el DOM.
 */
function vaciarCarrito() {
    articulosCarrito = [];
    guardarCarrito();
    carritoHTML();
    actualizarContadorCarrito();
    alert("Se ha vaciado el carrito.");
}


// ============ Funciones de Pago ============

function realizarPago(e) {
    e.preventDefault();
    const metodo = document.querySelector('input[name="metodo"]:checked');
    const tarjeta = document.getElementById('numero-tarjeta').value.trim();

    if (metodo && tarjeta !== "") {
        alert("¡Tu compra está realizada! Redirigiendo a inicio...");
        modalPago.style.display = 'none';
        formularioPago.reset();
        vaciarCarrito(); // Vacía el carrito después de la compra exitosa
        window.location.href = "index.html";
    } else {
        alert("Por favor completa los datos de pago.");
    }
}

// ============ Expose Functions Globally ============
window.agregarProductoAlCarrito = agregarProductoAlCarrito;
window.eliminarProducto = eliminarProducto;
window.vaciarCarrito = vaciarCarrito;
window.carritoHTML = carritoHTML;
window.actualizarCantidad = actualizarCantidad;
window.actualizarContadorCarrito = actualizarContadorCarrito;

// ============ Initialization ============
document.addEventListener('DOMContentLoaded', () => {
    // Load carrito from localStorage
    cargarCarrito();
    actualizarContadorCarrito(); // LLAMADA INICIAL al cargar la página

    // Check if carrito elements exist before initializing
    if (listaCarrito) {
        carritoHTML();
        // Los listeners ahora manejan la información de Color y Talla
        listaCarrito.addEventListener("click", eliminarProducto);
        listaCarrito.addEventListener('change', actualizarCantidad);
        vaciarCarritoBtn?.addEventListener('click', vaciarCarrito);
    }


    // Inicializar eventos del modal
    if (btnCheckout && modalPago && cerrarModalPago) {
        btnCheckout.addEventListener('click', () => {
            if (articulosCarrito.length > 0) {
                modalPago.style.display = 'flex';
            } else {
                alert("El carrito está vacío. Agrega productos para pagar.");
            }
        });

        cerrarModalPago.addEventListener('click', () => {
            modalPago.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalPago) {
                modalPago.style.display = 'none';
            }
        });

        formularioPago?.addEventListener('submit', realizarPago);
    }

    // ============ Add Event Listener for Carrito Icon ============
    const carritoIcono = document.getElementById('carrito-icono');

    if (carritoIcono) {
        carritoIcono.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'carrito.html';
        });
    }

    // ============ LISTENERS GLOBALES PARA AGREGAR PRODUCTOS (CORREGIDOS) ============

    // 1. LISTENER DELEGADO PARA BOTONES DEL CATÁLOGO (Evento 'click')
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('agregar-carrito')) {
            agregarProductoAlCarrito(e);
        }
    });

    // 2. LISTENER PARA LA PÁGINA DE DETALLE (CustomEvent 'agregar-variante')
    document.body.addEventListener('agregar-variante', agregarProductoAlCarrito);
}); 