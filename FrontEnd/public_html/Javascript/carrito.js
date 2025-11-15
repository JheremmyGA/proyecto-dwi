import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// ============ Variables Globales ============
const listaCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const btnCheckout = document.getElementById('img-carrito');
const contadorCarrito = document.getElementById('contador-carrito');

let articulosCarrito = [];

// Modales de Pago
const modalPago = document.getElementById('modal-pago');
const cerrarModalPago = document.getElementById('cerrar-modal');
const formularioPago = document.getElementById('formulario-pago');


// ============ FUNCIONES DE PERSISTENCIA ============

function guardarCarrito() {
    if(PERSISTENT_DATA.GetUsuarioLogeado() === 'false') PERSISTENT_DATA.GuardarCarrito(JSON.stringify(articulosCarrito));
}

async function cargarCarrito() {
    //const carritoGuardado = localStorage.getItem('articulosCarrito');
    //articulosCarrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    if(PERSISTENT_DATA.GetUsuarioLogeado() === 'true'){
        articulosCarrito = await HTTPS_Request.CargarCarrito(PERSISTENT_DATA.GetUserId());
    }
    else{
        const carritoGuardado = PERSISTENT_DATA.CargarCarrito();
        articulosCarrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }
    
    if(articulosCarrito == null) articulosCarrito = []
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
const normalizar = (valor) => valor ? String(valor).trim().toUpperCase() : 'N/A'; // Usar 'N/A' si no hay valor


// ============ Funciones del Carrito ============
/**
 * Agrega un producto al carrito, manejando CustomEvents y clicks del catálogo.
 */
async function agregarProductoAlCarrito(e) {
    cargarCarrito();

    let infoProducto = {};

    // 1. Obtener info del producto (CustomEvent de detalle_producto_prenda.js)
    if (e.detail && e.detail.producto) {
        // CAMINO A: El producto viene de la página de detalle
        infoProducto = e.detail.producto;
    } 
    else{
        return;
    }
    //else {
    //    // CAMINO B: El producto viene del catálogo (Evento de click normal)
//
    //    if (!e.target || !e.target.classList.contains('agregar-carrito')) {
    //        return;
    //    }
//
    //    e.preventDefault();
//
    //    const btn = e.target;
    //    const idBase = btn.getAttribute("data-id");
//
    //    // 🔥 CORRECCIÓN CLAVE: Generar ID y datos para productos de Catálogo
    //    const colorCat = 'UNICO';
    //    const tallaCat = 'UNICA';
//
    //    infoProducto = {
    //        imagen: btn.getAttribute("data-imagen"),
    //        nombre: btn.getAttribute("data-nombre"),
    //        precio: btn.getAttribute("data-precio"),
    //        // ID Único generado para el Catálogo
    //        id_unico: normalizar(`${idBase}-${tallaCat}-${colorCat}`),
    //        color: colorCat,
    //        talla: tallaCat,
    //        cantidad: parseInt(btn.getAttribute("data-cantidad")) || 1
    //    };
    //}

    // 2. Normalización de Precio 
    const precioLimpio = String(infoProducto.precio).replace('S/.', '').trim();
    infoProducto.precio = parseFloat(precioLimpio);

    // 3. Normalizar propiedades para la agrupación
    // El id_unico ya debe venir normalizado o se normaliza aquí
    //const idUnicoNormalizado = infoProducto.id_unico;
    //infoProducto.color_unico = normalizar(infoProducto.color);
    //infoProducto.talla_unico = normalizar(infoProducto.talla);
    //infoProducto.id_unico = idUnicoNormalizado; // Aseguramos que el objeto use el ID normalizado

    // 4. Estandarizar el Nombre para la interfaz (nombre_ui)
    const variaciones = [
        infoProducto.color,
        infoProducto.talla
    ].filter(v => v).join(' / ');

    infoProducto.nombre_ui = infoProducto.nombre.trim();
    if (variaciones) {
        infoProducto.nombre_ui += ` - ${variaciones}`;
    }

    // 5. VALIDACIÓN POR ID ÚNICO (Agrupación)
    let existe = articulosCarrito.find(producto =>
        producto.id_unico === infoProducto.id_unico
    );

    let total = 0;

    // 6. Lógica de adición/actualización
    if (existe) {
        existe.cantidad += infoProducto.cantidad;
        total = existe.cantidad;
    } else {
        articulosCarrito.push(infoProducto);
        total = infoProducto.cantidad;
    }

    const data = {
        productId : infoProducto.id_unico,
        quantity: total
    };

    await HTTPS_Request.InsertarProductoCarrito(data,PERSISTENT_DATA.GetUserId());

    // 7. Guardar y actualizar UI
    guardarCarrito();
    carritoHTML();
    actualizarContadorCarrito();

    alert(`"${infoProducto.nombre_ui}" agregado al carrito.`);
}


/**
 * Genera el HTML del carrito basándose en el array articulosCarrito.
 * Utiliza la nueva propiedad nombre_ui.
 */
function carritoHTML() {
    if (!listaCarrito) return;

    vaciarCarritoDOM();

    let totalCompra = 0;

    articulosCarrito.forEach(articulo => {
        const precioUnitario = parseFloat(articulo.precio);

        if (isNaN(precioUnitario)) {
            console.error(`Error de precio para el artículo: ${articulo.nombre}`);
            return;
        }

        const subtotal = (precioUnitario * articulo.cantidad).toFixed(2);
        totalCompra += parseFloat(subtotal);

        // Usar la propiedad 'nombre_ui' que ya contiene las variaciones formateadas
        const nombreMostrar = articulo.nombre_ui || articulo.nombre;

        const row = document.createElement('tr');
        row.setAttribute("data-id", articulo.id_unico);
        row.innerHTML = `
    <td><img src="${articulo.imagen}" width="80" height="60" style="object-fit: cover;"></td>
    <td>
        ${nombreMostrar}
    </td>
    <td class="precio-subtotal">S/. ${subtotal}</td>
    <td>
        <input 
            type="number" 
            min="1" 
            value="${articulo.cantidad}" 
            class="cantidad-producto" 
            data-id="${articulo.id_unico}" 
            data-color="${articulo.color || ''}"
            data-talla="${articulo.talla || ''}"
            style="width: 60px; text-align: center;"
        >
    </td>
    <td>
        <a href="#" class="eliminar-producto" 
            data-id="${articulo.id_unico}" 
            data-color="${articulo.color || ''}"
            data-talla="${articulo.talla || ''}">X
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


// Las demás funciones (eliminarProducto, actualizarCantidad, vaciarCarritoDOM, vaciarCarrito, 
// realizarPago y la inicialización con event listeners) se mantienen igual.

// MANTENIENDO EL RESTO DEL CÓDIGO ORIGINAL SIN CAMBIOS DE LÓGICA GRANDE:

/**
 * Elimina un producto del carrito (por ID, Color y Talla).
 */
async function eliminarProducto(e) {
    if (e.target.classList.contains("eliminar-producto") ||
        e.target.classList.contains("borrar-curso")) {

        e.preventDefault();

        // Normalizar los data-attributes leídos
        const productoIdUnico = e.target.getAttribute('data-id');
        const colorUnico = e.target.getAttribute('data-color');
        const tallaUnico = e.target.getAttribute('data-talla');

        // Filtrar por la combinación única NORMALIZADA
        articulosCarrito = articulosCarrito.filter(
            articulo => !(articulo.id_unico === productoIdUnico && articulo.color === colorUnico && articulo.talla === tallaUnico)
        );
        
        await HTTPS_Request.DeleteProductoCarrito(productoIdUnico,PERSISTENT_DATA.GetUserId());

        guardarCarrito();
        carritoHTML();
        actualizarContadorCarrito();
    }
}


/**
 * Actualiza la cantidad de un artículo (por ID, Color y Talla) y recalcula.
 */
async function actualizarCantidad(e) {
    if (e.target.classList.contains('cantidad-producto')) {
        const input = e.target;

        // Normalizar los data-attributes leídos
        const productoIdUnico = input.getAttribute('data-id');
        const colorUnico = input.getAttribute('data-color');
        const tallaUnico = input.getAttribute('data-talla');

        let nuevaCantidad = parseInt(input.value);

        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
            nuevaCantidad = 1;
            input.value = 1;
        }

        articulosCarrito = articulosCarrito.map(articulo => {
            // Condición de actualización por ID, Color y Talla NORMALIZADOS
            if (articulo.id_unico === productoIdUnico && articulo.color === colorUnico && articulo.talla === tallaUnico) {
                articulo.cantidad = nuevaCantidad;
            }
            return articulo;
        });

        const data = {
            productId : productoIdUnico,
            quantity: nuevaCantidad
        };

        await HTTPS_Request.InsertarProductoCarrito(data,PERSISTENT_DATA.GetUserId());

        guardarCarrito();
        carritoHTML();
        actualizarContadorCarrito();
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
async function vaciarCarrito() {
    if(PERSISTENT_DATA.GetUsuarioLogeado() === 'true') await HTTPS_Request.DeleteCarrito(PERSISTENT_DATA.GetUserId());
    articulosCarrito = [];
    guardarCarrito();
    carritoHTML();
    actualizarContadorCarrito();
    alert("Se ha vaciado el carrito.");
}


// ============ Funciones de Pago ============

async function realizarPago(e) {
    e.preventDefault();
    const metodo = document.querySelector('input[name="metodo"]:checked');
    const tarjeta = document.getElementById('numero-tarjeta').value.trim();

    if (metodo && tarjeta !== "") {
        alert("¡Tu compra está realizada! Redirigiendo a inicio...");
        modalPago.style.display = 'none';
        formularioPago.reset();
        await vaciarCarrito(); // Vacía el carrito después de la compra exitosa
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
    InitComponentes();
});

async function InitComponentes(){
    // Load carrito from localStorage
    await cargarCarrito();
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
}