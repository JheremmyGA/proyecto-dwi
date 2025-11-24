import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// --- DATOS SIMULADOS PARA SECCIONES INFERIORES ---
const productosPrueba = [
    { nombre: "Loose Jeans", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Chaleco de traje", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png" },
    { nombre: "Casaca en lona de algodón", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Zapatos Derby", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png" }
];

const productData = {
    imagenes: {
        Negro: "imagenes/hombre/Polo/Polo Petit Piqué Hombre Lacoste.png",
        Blanco: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png",
    }
};
// ============ FUNCIÓN DE NORMALIZACIÓN (Necesaria aquí) ============
const normalizar = (valor) => valor ? String(valor).trim().toUpperCase() : '';



// --- ESTADO GLOBAL ---
let selectedColor;
let selectedSize;
let selectedQuantity = 1;
let detalleProducto;

// CÓDIGO FINAL CORREGIDO para MostrarDetalleProducto en detalle_producto_prenda.js

async function MostrarDetalleProducto() {

    // 1. OBTENER EL ID ESTABLE DE LA SESIÓN
    const selectedId = PERSISTENT_DATA.GetSelectedProductDetails();

    // 2. CARGAR EL PRODUCTO
    detalleProducto = await HTTPS_Request.GetDetalleProducto(selectedId);

    if (!detalleProducto) return;

    // 🔥 SOLUCIÓN CRÍTICA: Asegurar que detalleProducto.id SIEMPRE sea estable.
    // Si la API devuelve el producto sin ID (null/undefined), usamos el ID de la sesión.
    if (!detalleProducto.id) {
        // Usamos el ID de la sesión (que es el ID fijo del producto seleccionado)
        detalleProducto.id = selectedId || 'ID_PRODUCTO_FIJO_POR_DEFECTO';
    }
    // ¡Asegúrate de que NO haya código aquí o en la API que use Date.now()!


    selectedColor = detalleProducto.tallasColores[0].color;
    selectedSize = detalleProducto.tallasColores[0].talla;

    // Encabezado y precio
    const nameEl = document.getElementById('product-name');
    const brandEl = document.getElementById('product-brand');
    const priceEl = document.getElementById('product-price');

    if (nameEl) nameEl.textContent = detalleProducto.nombre;
    if (brandEl) brandEl.textContent = detalleProducto.marca;
    if (priceEl) priceEl.textContent = `S/ ${detalleProducto.precio.toFixed(2)}`;

    renderCurrentColorTitle();
    renderColorSelector();
    updateMainImage();
    renderSizeButtons();
    updateStockDisplay();
    updateQuantityButtons();
}

function MostrarVistaProductos() {

    // Secciones inferiores
    renderProductosPrueba('loMasVendidos', productosPrueba);
    renderProductosPrueba('liquidacion', productosPrueba);

    // Selectores y UI
    const selColorEl = document.getElementById('selected-color-name');
    if (selColorEl) selColorEl.textContent = selectedColor;
}

/* Color selector */
function renderColorSelector() {
    const colorSwatchesDiv = document.getElementById('color-swatches');
    if (!colorSwatchesDiv) return;
    colorSwatchesDiv.innerHTML = '';

    const uniqueColors = [...new Set(detalleProducto.tallasColores.map(item => item.color))];

    uniqueColors.forEach(color => {
        const colorHex = color === 'Negro' ? '000000' : 'FFFFFF';
        const textColor = color === 'Negro' ? 'FFFFFF' : '000000';
        const swatch = document.createElement('img');

        swatch.alt = color;
        swatch.className = `swatch-color w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${color === selectedColor ? 'border-red-600 shadow-md' : 'border-gray-300'}`;
        swatch.src = `https://placehold.co/40x40/${colorHex}/${textColor}?text=`;

        swatch.onclick = () => handleColorChange(color);
        colorSwatchesDiv.appendChild(swatch);
    });
}


function renderSizeButtons() {
    const sizeButtonsDiv = document.getElementById('size-buttons');
    if (!sizeButtonsDiv) return;
    sizeButtonsDiv.innerHTML = '';

    const allSizes = [...new Set(detalleProducto.tallasColores.map(item => item.talla))];
    const colorOptions = detalleProducto.tallasColores.filter(item => item.color === selectedColor);

    allSizes.forEach(talla => {
        const option = colorOptions.find(item => item.talla === talla);
        const stock = option ? option.stock : 0;
        const isDisabled = stock === 0;

        const button = document.createElement('button');
        button.textContent = talla;
        let buttonClass = `size-button ${talla === selectedSize ? 'selected talla-seleccionada' : 'border-gray-300'} ${isDisabled ? 'disabled' : ''}`;

        button.className = buttonClass;
        button.disabled = isDisabled;

        button.onclick = () => {
            if (!isDisabled) {
                handleSizeChange(talla);
            }
        };

        sizeButtonsDiv.appendChild(button);
    });

    const currentOption = colorOptions.find(item => item.talla === selectedSize);
    if (!currentOption || currentOption.stock === 0) {
        const firstAvailableOption = colorOptions.find(item => item.stock > 0);
        if (firstAvailableOption) {
            selectedSize = firstAvailableOption.talla;
        } else {
            selectedSize = '';
        }
        renderSizeButtons();
    }
}

/* Stock display and add-to-cart state */
function updateStockDisplay() {
    const currentOption = detalleProducto.tallasColores.find(item =>
        item.color === selectedColor && item.talla === selectedSize
    );
    const stock = currentOption ? currentOption.stock : 0;

    const stockEl = document.getElementById('stock-disponible');
    if (stockEl) {
        stockEl.textContent = stock;
        stockEl.className = `font-bold ${stock > 0 ? 'text-green-600' : 'text-red-600'}`;
    }

    const agregarCarrito = document.getElementById('agregarCarrito');
    if (agregarCarrito) {
        if (stock > 0) {
            agregarCarrito.disabled = false;
            agregarCarrito.textContent = 'Añadir al carrito';
        } else {
            agregarCarrito.disabled = true;
            agregarCarrito.textContent = 'Agotado';
        }
    }

    // Reset quantity and controls
    selectedQuantity = 1;
    const qtyInput = document.getElementById('cantidad-seleccionada');
    if (qtyInput) qtyInput.value = selectedQuantity;
    updateQuantityButtons();
}

/* Handlers */
function handleColorChange(newColor) {
    if (newColor === selectedColor) return;
    selectedColor = newColor;

    updateMainImage();
    renderCurrentColorTitle();
    renderColorSelector();
    renderSizeButtons();
    updateStockDisplay();
}

function renderCurrentColorTitle() {
    const selColorEl = document.getElementById('selected-color-name');
    if (selColorEl) selColorEl.textContent = selectedColor;

}

function handleSizeChange(newSize) {
    selectedSize = newSize;
    renderSizeButtons();
    updateStockDisplay();
}

function handleQuantityChange(change) {
    const currentOption = detalleProducto.tallasColores.find(item =>
        item.color === selectedColor && item.talla === selectedSize
    );
    const maxStock = currentOption ? currentOption.stock : 0;

    let newQuantity = selectedQuantity + change;

    if (newQuantity < 1) newQuantity = 1;
    else if (newQuantity > maxStock) newQuantity = maxStock;

    selectedQuantity = newQuantity;
    const qtyInput = document.getElementById('cantidad-seleccionada');
    if (qtyInput) qtyInput.value = selectedQuantity;
    updateQuantityButtons(maxStock);
}

function updateQuantityButtons(maxStock) {
    const stockVal = (typeof maxStock === 'number' && maxStock >= 0) ? maxStock : parseInt(document.getElementById('stock-disponible')?.textContent || '0', 10);
    const btnDecrement = document.getElementById('btn-decremento');
    const btnIncrement = document.getElementById('btn-incremento');

    if (btnDecrement) btnDecrement.disabled = selectedQuantity <= 1;
    if (btnIncrement) btnIncrement.disabled = selectedQuantity >= stockVal || stockVal === 0;
}

function updateMainImage() {
    const currentOption = detalleProducto.tallasColores.find(item =>
        item.color === selectedColor && item.talla === selectedSize
    );

    const PreviewImage = currentOption ? currentOption.PreviewImage : "";

    const mainImage = document.getElementById('imagen-producto-principal');
    if (mainImage && PreviewImage) mainImage.src = PreviewImage;
}


function renderProductosPrueba(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'contenedor-prendas';

        // ✅ Asegúrate de que el precio sea número
        const precioNumerico = parseFloat(product.precio);

        tarjeta.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}">
        <p class="precio">S/ ${precioNumerico.toFixed(2)}</p>
        <p class="nombre">${product.nombre}</p>
        <p class="marca">${product.marca}</p>
    `;
        container.appendChild(tarjeta);
    });

}

/* Simple redirect util kept as in original */
function redirigir(nombre) {
    window.location.href = nombre;
}

/* Expose certain functions to window so inline onclick works (keeps compatibility) */
window.handleQuantityChange = handleQuantityChange;
window.handleSizeChange = handleSizeChange;
window.handleColorChange = handleColorChange;
window.redirigir = redirigir;





/* Initialize when DOM ready */
document.addEventListener('DOMContentLoaded', () => {

    // --- Carga inicial de datos (Se ejecuta solo una vez al inicio) ---
    MostrarDetalleProducto();
    MostrarVistaProductos();

    // --- LÓGICA DE AÑADIR AL CARRITO CORREGIDA (SOLO DISPARA EVENTO) ---
    const botonAgregar = document.getElementById('agregarCarrito');
    if (botonAgregar) {
        botonAgregar.addEventListener('click', (e) => {
            e.preventDefault();

            // Aseguramos que el producto tenga un ID base estable. Usamos 'PROD_GENERICO' si no existe.
            const idBaseEstable = detalleProducto && detalleProducto.id ? detalleProducto.id : 'PROD_GENERICO';

            if (!detalleProducto || !selectedSize || !selectedColor || selectedQuantity < 1) {
                alert("Por favor, selecciona una talla, color y cantidad válida.");
                return;
            }

            const dataFind = detalleProducto.tallasColores.find(x => x.color == selectedColor && x.talla == selectedSize);

            // 1. Crear la información del producto con variante
            const infoProducto = {
                // Generamos el ID ÚNICO usando el ID Base ESTABLE, la Talla y el Color NORMALIZADOS.
                id_unico: dataFind.sku,
                nombre: detalleProducto.nombre,
                // Aseguramos que el precio sea string con 2 decimales
                precio: detalleProducto.precio.toFixed(2),
                imagen: productData.imagenes[selectedColor],
                cantidad: selectedQuantity,
                color: selectedColor,
                talla: selectedSize,
            };

            // Disparar el evento personalizado (carrito.js lo capturará)
            const eventoCarrito = new CustomEvent('agregar-variante', {
                bubbles: true,
                detail: { producto: infoProducto }
            });
            document.body.dispatchEvent(eventoCarrito);

            if (typeof window.actualizarContadorCarrito === 'function') {
                window.actualizarContadorCarrito();
            }
        });
    }

    // --- ACTIVAR COLOR Y TALLA MANUALMENTE (Se mantiene el código original de activación) ---
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("swatch-color")) {
            document.querySelectorAll(".swatch-color")
                .forEach(c => c.classList.remove("color-seleccionado"));
            e.target.classList.add("color-seleccionado");
        }
    });

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("size-button")) {
            document.querySelectorAll(".size-button")
                .forEach(t => t.classList.remove("talla-seleccionada"));
            e.target.classList.add("talla-seleccionada");
        }
    });
});




//data false ver detalle
document.addEventListener("DOMContentLoaded", function () {

    function cargarSeccionesDetalle() {

        const listaLoMasVendidos = [
            {
                id: 701,
                nombre: "Pantalón Hombre",
                precio: 99.90,
                marca: "Marca",
                PreviewImage: ""
            },
            {
                id: 702,
                nombre: "Casaca Hombre",
                precio: 149.90,
                marca: "Marca",
                PreviewImage: ""
            },
            {
                id: 703,
                nombre: "Polo Hombre",
                precio: 39.90,
                marca: "Marca",
                PreviewImage: ""
            },
            {
                id: 704,
                nombre: "Camisa Hombre",
                precio: 89.90,
                marca: "Marca",
                PreviewImage: ""
            }
        ];

        const listaLiquidacion = [
            {
                id: 705,
                nombre: "Producto Liquidación 1",
                precio: 49.90,
                marca: "Marca",
                PreviewImage: ""
            },
            {
                id: 706,
                nombre: "Producto Liquidación 2",
                precio: 59.90,
                marca: "Marca",
                PreviewImage: ""
            },
            {
                id: 707,
                nombre: "Producto Liquidación 3",
                precio: 29.90,
                marca: "Marca",
                PreviewImage: ""
            },
            {
                id: 708,
                nombre: "Producto Liquidación 4",
                precio: 19.90,
                marca: "Marca",
                PreviewImage: ""
            }
        ];

        cargarListaEnCuadricula(listaLoMasVendidos, "loMasVendidos");
        cargarListaEnCuadricula(listaLiquidacion, "liquidacion");
    }


    function cargarListaEnCuadricula(lista, idContenedor) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor) return;

        contenedor.innerHTML = "";

        lista.forEach(producto => {
            const tarjeta = crearTarjetaProducto(producto);
            contenedor.appendChild(tarjeta);
        });
    }


    function crearTarjetaProducto(producto) {

        const imagen = producto.PreviewImage && producto.PreviewImage.trim() !== ""
            ? producto.PreviewImage
            : "imagenes/hombre/Poleras/";

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");


        tarjeta.innerHTML = `
            <div class="imagen-container">
                <img src="${imagen}" alt="${producto.nombre}">
            </div>
            <p class="precio">S/. ${producto.precio.toFixed(2)}</p>
            <p class="nombre">${producto.nombre}</p>
            <p class="marca">${producto.marca}</p>
            <button class="btn-detalle">Ver detalle</button>
        `;

        return tarjeta;
    }

    cargarSeccionesDetalle();
});
