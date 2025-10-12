
// --- DATOS SIMULADOS DEL PRODUCTO PRINCIPAL ---
const productData = {
    id: 101,
    nombre: "Chaleco de traje",
    marca: "Basement",
    precio: 50.00,
    moneda: "S/",
    imagenes: {
        Negro: "imagenes/hombre/Poleras/Poleron Doo.png",
        Blanco: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png",
    },
    tallasColores: [
        { id: 1, talla: "S", color: "Negro", stock: 5, sku: "001N_S" },
        { id: 2, talla: "M", color: "Negro", stock: 12, sku: "001N_M" },
        { id: 3, talla: "L", color: "Negro", stock: 8, sku: "001N_L" },
        { id: 4, talla: "XL", color: "Negro", stock: 1, sku: "001N_XL" },
        { id: 5, talla: "S", color: "Blanco", stock: 20, sku: "001B_S" },
        { id: 6, talla: "M", color: "Blanco", stock: 15, sku: "001B_M" },
        { id: 7, talla: "L", color: "Blanco", stock: 0, sku: "001B_L" },
        { id: 8, talla: "XL", color: "Blanco", stock: 3, sku: "001B_XL" }
    ]
};

// --- DATOS SIMULADOS PARA SECCIONES INFERIORES ---
const relatedProducts = [
    { nombre: "Loose Jeans", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Chaleco de traje", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png"},
    { nombre: "Casaca en lona de algodón", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Zapatos Derby", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png" }
];

// --- ESTADO GLOBAL ---
let selectedColor = productData.tallasColores[0].color;
let selectedSize = productData.tallasColores[0].talla;
let selectedQuantity = 1;



function initializeProductView() {
    // Encabezado y precio
    const nameEl = document.getElementById('product-name');
    const brandEl = document.getElementById('product-brand');
    const priceEl = document.getElementById('product-price');

    if (nameEl) nameEl.textContent = productData.nombre;
    if (brandEl) brandEl.textContent = productData.marca;
    if (priceEl) priceEl.textContent = `${productData.moneda} ${productData.precio.toFixed(2)}`;

    // Secciones inferiores
    renderRelatedProducts('loMasVendidos', relatedProducts, 'bg-white text-gray-900');
    renderRelatedProducts('liquidacion', relatedProducts, 'bg-white text-gray-900');

    // Selectores y UI
    renderColorSelector();
    updateMainImage(productData.imagenes[selectedColor]);
    renderSizeButtons();
    updateStockDisplay();
    updateQuantityButtons();

    const selColorEl = document.getElementById('selected-color-name');
    if (selColorEl) selColorEl.textContent = selectedColor;
}

/* Color selector */
function renderColorSelector() {
    const colorSwatchesDiv = document.getElementById('color-swatches');
    if (!colorSwatchesDiv) return;
    colorSwatchesDiv.innerHTML = '';

    const uniqueColors = [...new Set(productData.tallasColores.map(item => item.color))];

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

    const allSizes = [...new Set(productData.tallasColores.map(item => item.talla))];
    const colorOptions = productData.tallasColores.filter(item => item.color === selectedColor);

    allSizes.forEach(talla => {
        const option = colorOptions.find(item => item.talla === talla);
        const stock = option ? option.stock : 0;
        const isDisabled = stock === 0;

        const button = document.createElement('button');
        button.textContent = talla;
        button.className = `size-button px-4 py-2 border rounded-xl font-semibold text-gray-800 ${talla === selectedSize ? 'selected' : 'border-gray-300'} ${isDisabled ? 'disabled' : ''}`;
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
    const currentOption = productData.tallasColores.find(item =>
        item.color === selectedColor && item.talla === selectedSize
    );
    const stock = currentOption ? currentOption.stock : 0;

    const stockEl = document.getElementById('current-stock');
    if (stockEl) {
        stockEl.textContent = stock;
        stockEl.className = `font-bold ${stock > 0 ? 'text-green-600' : 'text-red-600'}`;
    }

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        if (stock > 0) {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = 'Añadir al carrito';
        } else {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Agotado';
        }
    }

    // Reset quantity and controls
    selectedQuantity = 1;
    const qtyInput = document.getElementById('quantity-input');
    if (qtyInput) qtyInput.value = selectedQuantity;
    updateQuantityButtons();
}

/* Handlers */
function handleColorChange(newColor) {
    if (newColor === selectedColor) return;
    selectedColor = newColor;

    const selColorEl = document.getElementById('selected-color-name');
    if (selColorEl) selColorEl.textContent = newColor;

    const newImageUrl = productData.imagenes[newColor];
    updateMainImage(newImageUrl);
    renderColorSelector();
    renderSizeButtons();
    updateStockDisplay();
}

function handleSizeChange(newSize) {
    selectedSize = newSize;
    renderSizeButtons();
    updateStockDisplay();
}

function handleQuantityChange(change) {
    const currentOption = productData.tallasColores.find(item =>
        item.color === selectedColor && item.talla === selectedSize
    );
    const maxStock = currentOption ? currentOption.stock : 0;

    let newQuantity = selectedQuantity + change;

    if (newQuantity < 1) newQuantity = 1;
    else if (newQuantity > maxStock) newQuantity = maxStock;

    selectedQuantity = newQuantity;
    const qtyInput = document.getElementById('quantity-input');
    if (qtyInput) qtyInput.value = selectedQuantity;
    updateQuantityButtons(maxStock);
}

function updateQuantityButtons(maxStock) {
    const stockVal = (typeof maxStock === 'number' && maxStock >= 0) ? maxStock : parseInt(document.getElementById('current-stock')?.textContent || '0', 10);
    const btnDecrement = document.getElementById('btn-decrement');
    const btnIncrement = document.getElementById('btn-increment');

    if (btnDecrement) btnDecrement.disabled = selectedQuantity <= 1;
    if (btnIncrement) btnIncrement.disabled = selectedQuantity >= stockVal || stockVal === 0;
}

function updateMainImage(newUrl) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage && newUrl) mainImage.src = newUrl;
}

/* Render products in bottom sections */
function renderRelatedProducts(containerId, products, cardClasses) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // Reutilizar la clase .tarjeta-producto para mantener el mismo estilo
    products.forEach(product => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        tarjeta.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
            <p class="precio">${product.moneda || productData.moneda} ${product.precio.toFixed(2)}</p>
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
window.initializeProductView = initializeProductView;

/* Initialize when DOM ready */
document.addEventListener('DOMContentLoaded', initializeProductView);
