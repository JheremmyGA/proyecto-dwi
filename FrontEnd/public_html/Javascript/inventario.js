import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

let datosProductos = null;

// Stock máximo para mostrar advertencia (de 10 a menos)
const UMBRAL_ADVERTENCIA = 10;
let productoSeleccionadoSKU = null; // Para guardar el SKU del producto seleccionado

// ==============================================
// LÓGICA DEL INVENTARIO
// ==============================================

function renderizarProductos(productos) {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-productos');
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = '';

    productos.forEach(producto => {
        const necesitaAdvertencia = producto.cantidad <= UMBRAL_ADVERTENCIA;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="sku">${producto.SKU}</td>
            <td class="nombre">${producto.nombre}</td>
            <td class="stock">
                ${producto.cantidad}
                ${necesitaAdvertencia ? `<i class='bx bxs-error-alt icono-advertencia' onclick="mostrarModal('modal-advertencia')"></i>` : ''}
            </td>
            <td class="acciones">
                <button class="boton-tabla boton-actualizar" data-sku="${producto.SKU}" onclick="mostrarModalActualizar(this)">ACTUALIZAR</button>
                <button class="boton-tabla boton-eliminar" data-sku="${producto.SKU}" onclick="mostrarModalEliminar(this)">ELIMINAR</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// ==============================================
// FUNCIONES DE MODALES
// ==============================================
function mostrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.add('mostrar');
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.remove('mostrar');
}

// ==============================================
// MODALES DE ACTUALIZAR Y ELIMINAR
// ==============================================
function mostrarModalActualizar(boton) {
    const SKU = boton.getAttribute('data-sku');
    const producto = datosProductos.find(p => p.SKU === SKU);

    if (producto) {
        productoSeleccionadoSKU = SKU;
        
        // Llenar campos informativos (readonly)
        document.getElementById('update-nombre').value = producto.nombre || '';
        document.getElementById('update-marca').value = producto.marca || '';
        document.getElementById('update-temporada').value = producto.temporada || '';
        document.getElementById('update-categoria').value = producto.categoria || '';
        document.getElementById('update-precio').value = producto.precio || '';
        document.getElementById('update-genero').value = producto.genero || '';
        document.getElementById('update-sku').value = producto.SKU || '';
        document.getElementById('update-color').value = producto.color || '';
        
        // Campo editable: Cantidad
        document.getElementById('update-cantidad').value = producto.cantidad || 0;
        
        // Actualizar tallas basado en género y categoría, luego establecer el valor
        actualizarTallasActualizar();
        document.getElementById('update-talla').value = producto.talla || '';
        
        mostrarModal('modal-actualizar');
    }
}

function mostrarModalEliminar(boton) {
    const SKU = boton.getAttribute('data-sku');
    const producto = datosProductos.find(p => p.SKU === SKU);

    if (producto) {
        productoSeleccionadoSKU = SKU;
        document.getElementById('nombre-producto-eliminar').textContent = producto.nombre;
        mostrarModal('modal-eliminar');
    }
}

async function manejarActualizacion(evento) {
    evento.preventDefault();

    const SKU = document.getElementById('update-sku').value;
    const nuevaCantidad = parseInt(document.getElementById('update-cantidad').value);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
        alert('Por favor ingresa un valor válido para la cantidad (0 o mayor).');
        return false;
    }

    const action = await HTTPS_Request.UpdateStock(SKU, nuevaCantidad);

    if(action == false){
        alert("Hubo un problema al actualizar el stock.");
        return false;
    }

    const indice = datosProductos.findIndex(p => p.SKU === SKU);
    if (indice !== -1) {
        datosProductos[indice].cantidad = nuevaCantidad;
        cerrarModal('modal-actualizar');
        renderizarProductos(datosProductos);
    } else {
        console.error("Error: Producto no encontrado.");
    }
}

async function ejecutarEliminacion() {
    if (productoSeleccionadoSKU) {
        await HTTPS_Request.DeleteItemInventario(productoSeleccionadoSKU);

        const indice = datosProductos.findIndex(p => p.SKU === productoSeleccionadoSKU);
        if (indice !== -1) {
            datosProductos.splice(indice, 1);
            cerrarModal('modal-eliminar');
            renderizarProductos(datosProductos);
        } else {
            console.error("Error: Producto no encontrado durante la eliminación.");
        }
    }
}

// ==============================================
// FUNCIÓN: AGREGAR PRODUCTO
// ==============================================
async function manejarAgregar(evento) {
    evento.preventDefault();

    // ===== INPUTS GENERALES =====
    const nombre = document.getElementById('add-nombre').value.trim();
    const marca = document.getElementById('add-marca').value.trim();
    const temporada = document.getElementById('add-temporada').value.trim();
    const categoria = document.getElementById('add-categoria').value.trim();
    const precio = parseFloat(document.getElementById('add-precio').value.trim());
    const genero = document.getElementById('add-genero').value.trim();
    const imagenGeneral = document.getElementById('add-imagen-general').value.trim();

    if (!nombre || !marca || !temporada || !categoria || !genero || isNaN(precio) || precio < 0) {
        alert("Por favor completa todos los campos generales correctamente.");
        return;
    }

    // ===== INPUTS DE DETALLES ESPECÍFICOS (VARIACIONES) =====
    const items = [];
    const variaciones = [];
    const contenedorVariaciones = document.getElementById('contenedor-variaciones');
    const itemsVariacion = contenedorVariaciones.querySelectorAll('.variacion-item');

    itemsVariacion.forEach((item) => {
        const SKU = item.querySelector('.input-sku').value.trim();
        const talla = item.querySelector('.input-talla').value.trim();
        const color = item.querySelector('.input-color').value.trim();
        const cantidad = parseInt(item.querySelector('.input-stock').value.trim());
        const inputArchivo = item.querySelector('.input-imagen');
        const ruta = inputArchivo && inputArchivo.files.length > 0 ? inputArchivo.files[0].name : '';

        if (!SKU || !talla || !color || isNaN(cantidad) || cantidad < 0) {
            alert("Por favor completa todos los campos de detalles específicos (SKU, Talla, Color, Cantidad).");
            return;
        }

        variaciones.push({
            SKU,
            talla,
            color,
            cantidad,
            ruta
        });

        items.push({
            // Propiedades de InventarioItemRequestDTO
            "SKU": SKU,
            "talla": talla,
            "color": color,
            "cantidad" : cantidad,
            "PreviewImage": "itemPreviewImage"
        });
    });

    if (variaciones.length === 0) {
        alert("Por favor agrega al menos una variación (SKU, Talla, Color, Cantidad).");
        return;
    }

    // ===== AGREGAR CADA VARIACIÓN COMO UNA FILA EN LA TABLA =====
    variaciones.forEach(variacion => {
        datosProductos.unshift({
            SKU: variacion.SKU,
            nombre: nombre,
            marca: marca,
            temporada: temporada,
            categoria: categoria,
            precio: precio,
            genero: genero,
            talla: variacion.talla,
            color: variacion.color,
            cantidad: variacion.cantidad,
            ruta: variacion.ruta
        });
    });

    // ===== MOSTRAR EN CONSOLA TODA LA INFORMACIÓN =====
    console.log('=== PRODUCTO AGREGADO ===');
    console.log('Detalles Generales:', { nombre, marca, temporada, categoria, precio, genero });
    console.log('Detalles Específicos (Variaciones):', variaciones);

    const inventarioGroupRequestDTO = {
        "nombre": nombre,
        "marca": marca,
        "temporada": temporada,
        "categoria": categoria,
        "genero": genero,
        "precio": precio,
        "PreviewImage": "PreviewImageGeneral", // Ruta relativa general
        "items": items
    };

    const TokenData = await HTTPS_Request.CrearProducto(inventarioGroupRequestDTO);
    //datosProductos = await HTTPS_Request.GetInventario();

    cerrarModal('modal-agregar');
    renderizarProductos(datosProductos);

    evento.target.reset();
}

// ==============================================
// FUNCIONES DE ACTUALIZACIÓN DE TALLAS
// ==============================================

// Función para actualizar tallas en modal AGREGAR
function actualizarTallasAgregar() {
    const generoSelect = document.getElementById('add-genero');
    const categoriaSelect = document.getElementById('add-categoria');
    const genero = generoSelect.value;
    const categoria = categoriaSelect.value;
    
    // Encontrar todos los selects de talla en las variaciones
    const contenedor = document.getElementById('contenedor-variaciones');
    const tallaSelects = contenedor.querySelectorAll('.input-talla');
    
    let opciones = [];
    
    if (genero === 'Caballeros' || genero === 'Damas') {
        // Verificar si es prenda superior o inferior
        const categoriasSuperiores = ['Blusa', 'Camisa', 'Polo', 'Cárdigan', 'Suéter', 'Ropa Deportiva', 'Ropa Interior', 'Abrigo', 'Chaqueta'];
        
        if (categoriasSuperiores.includes(categoria)) {
            opciones = ['S', 'M', 'L', 'XL'];
        } else {
            opciones = ['28', '30', '32', '34', '36', '38', '40'];
        }
    } else if (genero === 'Niños' || genero === 'Niñas') {
        opciones = ['2', '4', '6', '8', '10', '12', '14', '16'];
    }
    
    // Actualizar todos los selects de talla
    tallaSelects.forEach(select => {
        const valorActual = select.value;
        select.innerHTML = '<option value="">Seleccionar Talla</option>';
        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion;
            option.textContent = opcion;
            select.appendChild(option);
        });
        select.value = valorActual;
    });
}

// Función para actualizar tallas en modal ACTUALIZAR
function actualizarTallasActualizar() {
    const generoSelect = document.getElementById('update-genero');
    const categoriaSelect = document.getElementById('update-categoria');
    const genero = generoSelect.value;
    const categoria = categoriaSelect.value;
    
    const tallaSelect = document.getElementById('update-talla');
    const valorActual = tallaSelect.value;
    
    let opciones = [];
    
    if (genero === 'Caballeros' || genero === 'Damas') {
        const categoriasSuperiores = ['Blusa', 'Camisa', 'Polo', 'Cárdigan', 'Suéter', 'Ropa Deportiva', 'Ropa Interior', 'Abrigo', 'Chaqueta'];
        
        if (categoriasSuperiores.includes(categoria)) {
            opciones = ['S', 'M', 'L', 'XL'];
        } else {
            opciones = ['28', '30', '32', '34', '36', '38', '40'];
        }
    } else if (genero === 'Niños' || genero === 'Niñas') {
        opciones = ['2', '4', '6', '8', '10', '12', '14', '16'];
    }
    
    tallaSelect.innerHTML = '<option value="">Seleccionar Talla</option>';
    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        option.textContent = opcion;
        tallaSelect.appendChild(option);
    });
    tallaSelect.value = valorActual;
}

// ==============================================
// LÓGICA DE BÚSQUEDA Y FILTROS
// ==============================================

let filtrosActivos = {
    stockMin: null,
    stockMax: null
};

function buscarProductos(query) {
    query = query.toLowerCase().trim();
    
    let productosFiltrados = datosProductos;
    if (filtrosActivos.stockMin !== null || filtrosActivos.stockMax !== null) {
        productosFiltrados = productosFiltrados.filter(producto => {
            let cumpleFiltros = true;
            if (filtrosActivos.stockMin !== null) {
                cumpleFiltros = cumpleFiltros && producto.cantidad >= filtrosActivos.stockMin;
            }
            if (filtrosActivos.stockMax !== null) {
                cumpleFiltros = cumpleFiltros && producto.cantidad <= filtrosActivos.stockMax;
            }
            return cumpleFiltros;
        });
    }

    if (!query) {
        return productosFiltrados;
    }
    
    return productosFiltrados.filter(producto => 
        producto.SKU.toLowerCase().includes(query) || producto.nombre.toLowerCase().includes(query)
    );
}

function limpiarFiltros() {
    document.getElementById('filtro-stock-min').value = '';
    document.getElementById('filtro-stock-max').value = '';
    
    filtrosActivos.stockMin = null;
    filtrosActivos.stockMax = null;

    const inputBuscador = document.querySelector('.input-buscador');
    const resultados = buscarProductos(inputBuscador ? inputBuscador.value : '');
    
    renderizarProductos(resultados);
    cerrarModal('modal-filtros');
}

function aplicarFiltros() {
    const stockMin = document.getElementById('filtro-stock-min').value;
    const stockMax = document.getElementById('filtro-stock-max').value;

    filtrosActivos.stockMin = stockMin === '' ? null : parseInt(stockMin);
    filtrosActivos.stockMax = stockMax === '' ? null : parseInt(stockMax);

    const inputBuscador = document.querySelector('.input-buscador');
    const resultados = buscarProductos(inputBuscador ? inputBuscador.value : '');
    
    renderizarProductos(resultados);
    cerrarModal('modal-filtros');
}

// ==============================================
// LÓGICA DEL MENÚ LATERAL
// ==============================================
function inicializarMenuToggle() {
    const botonToggle = document.getElementById('boton-toggle-menu');
    const menuLateral = document.getElementById('menu-lateral') || document.querySelector('.menu-dashboard');
    const contenedorPrincipal = document.querySelector('.contenedor-principal');

    // Si no hay botón explícito para toggle o no se encontró el menú, mantenemos
    // el contenedor principal sin margen (full-width) por defecto.
    if (!botonToggle || !menuLateral) {
        if (contenedorPrincipal && window.innerWidth > 768) {
            // Asegurar estado inicial collapsed -> margin 0
            contenedorPrincipal.style.marginLeft = '0';
        }
        return;
    }

    botonToggle.addEventListener('click', () => {
        menuLateral.classList.toggle('colapsado');

        if (window.innerWidth > 768) {
            // Cuando el menú está abierto (no colapsado) aplicamos el ancho definido,
            // cuando está colapsado dejamos margin 0 (full-width) o un pequeño offset si prefieres.
            contenedorPrincipal.style.marginLeft = menuLateral.classList.contains('colapsado') ? '0' : 'var(--ancho-menu-abierto)';
        } else {
            menuLateral.classList.toggle('-translate-x-full');
        }
    });

    // Estado inicial: content full-width (collapsed). JS will apply open margin when toggled.
    if (contenedorPrincipal && window.innerWidth > 768) {
        contenedorPrincipal.style.marginLeft = '0';
    }
}

// ==============================================
// LÓGICA DE VARIACIONES Y GESTIÓN DE ARCHIVOS (UNIFICADO Y CORREGIDO)
// ==============================================

// 1. Manejo Dinámico de Variaciones (CORREGIDO PARA EL BOTÓN)
document.getElementById('btn-agregar-variacion').addEventListener('click', () => {
    const contenedor = document.getElementById('contenedor-variaciones');
    const nueva = document.createElement('div');
    nueva.classList.add('variacion-item');
    // Generar un ID único para el input de archivo (necesario para el label)
    const uniqueId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    nueva.innerHTML = `
        <input type="text" placeholder="SKU (Ej. 204362)" class="input-sku" required>
        <select class="input-talla" required>
            <option value="">Seleccionar Talla</option>
        </select>
        <select class="input-color" required>
            <option value="">Seleccionar Color</option>
            <option value="Negro">Negro</option>
            <option value="Blanco">Blanco</option>
            <option value="Rojo">Rojo</option>
            <option value="Azul Marino">Azul Marino</option>
            <option value="Beige">Beige</option>
            <option value="Verde Militar">Verde Militar</option>
            <option value="Gris Melange">Gris Melange</option>
            <option value="Burdeo">Burdeo</option>
            <option value="Mostaza">Mostaza</option>
            <option value="Rosado Pastel">Rosado Pastel</option>
        </select>
        <input type="number" placeholder="Cantidad" min="0" class="input-stock" required>
        
        <div class="form-grupo-archivo" style="display:flex; flex-direction: column; align-items: center; justify-content: center;">
            
            <input type="file" id="${uniqueId}" class="input-hidden-file input-imagen" accept="image/*" title="Subir imagen">
            
            <label for="${uniqueId}" class="custom-file-upload">
                <i class="fas fa-image"></i> Subir Imagen
            </label>
            
            <img class="preview-imagen" src="" alt="Vista previa" style="display:none; margin-top: 5px; width: 50px; height: 50px;">
        </div>

        <button type="button" class="btn-eliminar-variacion" title="Eliminar variación">×</button>
    `;
    contenedor.appendChild(nueva);
    // Actualizar tallas después de agregar la variación
    actualizarTallasAgregar();
});

// 2. Eliminar variación (se mantiene igual, asegurando la eliminación del padre)
document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-eliminar-variacion')) {
        // Eliminar el contenedor principal de la variación
        e.target.closest('.variacion-item').remove();
    }
});


// ... (Toda la lógica anterior del JS)

// 3. Lógica de Previsualización de Imágenes (General y Variaciones - UNIFICADO)
document.addEventListener('change', function (event) {
    const target = event.target;
    
    // Función para manejar la previsualización
    const handleImagePreview = (fileInput, previewElement) => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
                // Añadimos una verificación de tamaño si estás en el modal de variaciones
                if (previewElement.closest('.variacion-item')) {
                    previewElement.style.width = '50px';
                    previewElement.style.height = '50px';
                }
            };
            reader.readAsDataURL(file);
        } else {
            previewElement.src = '';
            previewElement.style.display = 'none';
        }
    };

    // Caso A: Imagen General
    if (target.id === 'add-imagen-general' && target.type === 'file') {
        // CORRECCIÓN: Usa 'preview-general' según tu HTML
        const preview = document.getElementById('preview-general'); 
        
        // Actualiza el texto en el span que muestra el nombre del archivo
        const nameDisplay = document.getElementById('nombre-archivo-general'); 
        
        if (nameDisplay && target.files.length > 0) {
            nameDisplay.textContent = target.files[0].name;
        } else if (nameDisplay) {
            nameDisplay.textContent = 'Ningún archivo seleccionado';
        }
        handleImagePreview(target, preview);
        
    // Caso B: Imágenes de Variaciones (Usamos la clase 'input-imagen' en el input[type="file"])
    } else if (target.classList.contains('input-imagen') && target.type === 'file') {
        const preview = target.closest('.form-grupo-archivo').querySelector('.preview-imagen');
        handleImagePreview(target, preview);
    }
});


// ==============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    InitPage();
});

async function InitPage(){
    datosProductos = await HTTPS_Request.GetInventario();

    renderizarProductos(datosProductos);
    inicializarMenuToggle();

    // Inicializar botón de filtros
    const botonFiltros = document.querySelector('.boton-filtros');
    if (botonFiltros) {
        botonFiltros.addEventListener('click', () => mostrarModal('modal-filtros'));
    }

    // Inicializar búsqueda
    const inputBuscador = document.querySelector('.input-buscador');
    if (inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const resultados = buscarProductos(e.target.value);
            renderizarProductos(resultados);
        });
    }

    // Formulario actualizar
    const formActualizar = document.getElementById('formulario-actualizar');
    if (formActualizar) formActualizar.addEventListener('submit', manejarActualizacion);

    // Formulario agregar
    const formAgregar = document.getElementById('formulario-agregar');
    if (formAgregar) formAgregar.addEventListener('submit', manejarAgregar);

    // Botón "AGREGAR" para abrir el modal
    const botonAgregar = document.querySelector('.boton-accion-principal');
    if (botonAgregar) {
        botonAgregar.addEventListener('click', () => {
            mostrarModal('modal-agregar');
            //MostrarFiltros();
        });
    }
}

async function MostrarFiltros(){
    const temporadas = await HTTPS_Request.GetTemporadas();
    if (!temporadas) return;
    crearFiltros("add-temporada", temporadas);

    const categorias = await HTTPS_Request.GetCategorias();
    if (!categorias) return;
    crearFiltros("add-categoria", categorias);

    const marcas = await HTTPS_Request.GetMarcas();
    if (!marcas) return;
    crearFiltros("add-marca", marcas);
}

function crearFiltros(id, data){
    const filtro = document.getElementById(id);
    filtro.innerHTML = ''; // Limpia la cuadrícula
    data.forEach(data => {
        filtro.appendChild(crearFiltro(data.nombre, data.nombre));
    });
}

function crearFiltro(value, text){
    const optionTodo = document.createElement("option");
        optionTodo.value = value; // valor vacío
        optionTodo.text = text;

    return optionTodo;
}

window.cerrarModal = cerrarModal;
window.mostrarModalActualizar = mostrarModalActualizar;
window.mostrarModalEliminar = mostrarModalEliminar;
window.ejecutarEliminacion = ejecutarEliminacion;
window.aplicarFiltros = aplicarFiltros;
window.limpiarFiltros = limpiarFiltros;
window.actualizarTallasAgregar = actualizarTallasAgregar;