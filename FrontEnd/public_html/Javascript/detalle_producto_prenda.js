import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// --- DATOS SIMULADOS PARA SECCIONES INFERIORES ---
const productosPrueba = [
    { nombre: "Loose Jeans", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Chaleco de traje", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png"},
    { nombre: "Casaca en lona de algodón", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Zapatos Derby", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png" }
];

const productData = {
    imagenes: {
        Negro: "imagenes/hombre/Poleras/Poleron Doo.png",
        Blanco: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png",
    }
};


// --- ESTADO GLOBAL ---
let selectedColor;
let selectedSize;
let selectedQuantity = 1;
let detalleProducto;


async function MostrarDetalleProducto(){

    detalleProducto = await HTTPS_Request.GetDetalleProducto(PERSISTENT_DATA.GetSelectedProductDetails());
    if (!detalleProducto) return;

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
    updateMainImage(productData.imagenes[selectedColor]);
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
        swatch.className = `w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${color === selectedColor ? 'border-red-600 shadow-md' : 'border-gray-300'}`;
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
        button.className = `size-button ${talla === selectedSize ? 'selected' : 'border-gray-300'} ${isDisabled ? 'disabled' : ''}`;
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
         // Re-render to reflect selection change
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

    const newImageUrl = productData.imagenes[newColor];
    updateMainImage(newImageUrl);
    renderCurrentColorTitle();
    renderColorSelector();
    renderSizeButtons();
    updateStockDisplay();
}

function renderCurrentColorTitle(){
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

function updateMainImage(newUrl) {
    const mainImage = document.getElementById('imagen-producto-principal');
    if (mainImage && newUrl) mainImage.src = newUrl;
}


function renderProductosPrueba(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'contenedor-prendas';
        tarjeta.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
                <p class="precio">S/ ${product.precio.toFixed(2)}</p>
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
//window.iniciarVistaProductos = iniciarVistaProductos;

/* Initialize when DOM ready */
document.addEventListener('DOMContentLoaded', ()=>{
    MostrarDetalleProducto();
    MostrarVistaProductos();
});
