function redirigir(nombre) {
  window.location.href = nombre;
}

// ============ CONTROL DE SECCIONES ============
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar solo inicio al cargar
    mostrarSeccion("inicio");
    actualizarEstadoSesion();
});

// Ocultar todas las secciones
function ocultarTodasLasSecciones() {
    const secciones = ["inicio", "Mi-Tienda", "Nosotros", "catalogo", "Contacto"];
    secciones.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

// Mostrar una sección específica
function mostrarSeccion(seccionId) {
    ocultarTodasLasSecciones();
    const seccion = document.getElementById(seccionId);
    if (seccion) seccion.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function regresarInicio() {
    mostrarSeccion("inicio");
}

// ============ CARRUSEL ============
function scrollCarrusel(id, direccion) {
    const carrusel = document.getElementById(id);
    const desplazamiento = 250;
    if (carrusel) {
        carrusel.scrollBy({ left: direccion * desplazamiento, behavior: "smooth" });
    }
}

const images = document.querySelectorAll(".hero img");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

let current = 0;
function showImage(index) {
    images.forEach(img => img.classList.remove("active"));
    images[index].classList.add("active");
}
if (rightArrow && leftArrow) {
    rightArrow.addEventListener("click", () => {
        current = (current + 1) % images.length;
        showImage(current);
    });
    leftArrow.addEventListener("click", () => {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
    });
}
showImage(current);

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

// ============ LOGIN Y REGISTRO ============
function registrarUsuario() {
    const usuario = document.getElementById("registroUsuario").value.trim();
    const clave = document.getElementById("registroClave").value.trim();

    if (!usuario || !clave) {
        alert("Complete todos los campos");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.find(u => u.usuario === usuario)) {
        alert("El usuario ya existe");
        return;
    }

    usuarios.push({ usuario, clave });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("¡Registro exitoso!");
    cerrarModalRegistro();
    mostrarModalLogin();
}

function iniciarSesion() {
    const usuario = document.getElementById("loginUsuario").value.trim();
    const clave = document.getElementById("loginClave").value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find(u => u.usuario === usuario && u.clave === clave);
    if (existe) {
        localStorage.setItem("usuarioActivo", usuario);
        actualizarEstadoSesion();
        cerrarModalLogin();
        alert(`Bienvenido ${usuario} 👋`);
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

function actualizarEstadoSesion() {
    const activo = localStorage.getItem("usuarioActivo");
    const btnLogin = document.querySelector(".btn-login");

    if (!btnLogin) return;

    if (activo) {
        btnLogin.innerHTML = `
            <span style="font-weight: 500;">Hola, ${activo}</span>
            <button class="btn-cerrar-sesion" onclick="cerrarSesion()">Cerrar sesión</button>
        `;
    } else {
        btnLogin.innerHTML = `<button onclick="mostrarModalLogin()">Iniciar sesión</button>`;
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    actualizarEstadoSesion();
    alert("Has cerrado sesión");
}

// ============ PRODUCTOS ============
const caracteristicasPorId = {
    "201": ["Tela de alta calidad", "Estructura de madera", "Color gris moderno", "Para 3 personas"],
    "202": ["Incluye puerto USB", "Cuero sintético", "Diseño seccional", "Color negro"],
    "203": ["Tela lavable", "Relleno de espuma", "Diseño moderno"],
    "204": ["Función cama", "Color azul verdoso", "Compacto y funcional"],
    "205": ["Madera de pino", "4 puertas con espejo", "Color roble oscuro", "Amplio espacio interior"],
    "206": ["Acabado mate blanco", "Puertas corredizas", "Incluye cajoneras", "Diseño moderno"],
    "207": ["Estilo rústico", "Color nogal", "Compartimentos ajustables", "Resistente a la humedad"],
    "208": ["Diseño minimalista", "Color gris claro", "Con cerradura de seguridad", "Fácil armado"],
    "209": ["LED de bajo consumo", "Base metálica cromada", "Luz cálida regulable", "Altura ajustable"],
    "210": ["Diseño vintage", "Pantalla de tela beige", "Interruptor táctil", "Ideal para salas o dormitorios"],
    "211": ["Estilo industrial", "Color negro mate", "Cable textil visible", "Soporta focos Edison"],
    "212": ["Luz RGB con control remoto", "Carga USB", "Modo nocturno", "Diseño moderno y compacto"],
    "213": ["Mesa para 6 personas", "Madera maciza", "Incluye 6 sillas acolchadas", "Color nogal claro"],
    "214": ["Mesa redonda", "Vidrio templado", "Base metálica negra", "Ideal para espacios pequeños"],
    "215": ["Estilo escandinavo", "Incluye banco y sillas", "Acabado en blanco y madera clara", "Fácil limpieza"],
    "216": ["Mesa extensible", "Hasta 8 personas", "Sillas con respaldo ergonómico", "Acabado resistente a rayaduras"],
};

// Modal de producto
let productoActual = {};

document.addEventListener("DOMContentLoaded", () => {
    const imagenesProductos = document.querySelectorAll(".item img");

    imagenesProductos.forEach(img => {
        img.addEventListener("click", () => {
            const contenedor = img.closest(".item");
            const boton = contenedor.querySelector(".agregar-carrito");

            const nombre = boton.getAttribute("data-nombre");
            const precio = boton.getAttribute("data-precio");
            const imagen = boton.getAttribute("data-imagen");
            const id = boton.getAttribute("data-id");

            document.getElementById("modalNombre").textContent = nombre;
            document.getElementById("modalPrecioNum").textContent = `S/. ${precio}`;
            document.getElementById("modalImagen").src = imagen;

            productoActual = { id, nombre, precio, imagen };

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
});

function cerrarModalProducto() {
    document.getElementById("modalProducto").style.display = "none";
}

document.getElementById("btnComprarDesdeModal").addEventListener("click", () => {
    const carrito = document.querySelector("#lista-carrito tbody");
    const existe = carrito.querySelector(`tr[data-id='${productoActual.id}']`);

    if (!existe) {
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", productoActual.id);
        fila.innerHTML = `
            <td><img src="${productoActual.imagen}" width="50"></td>
            <td>${productoActual.nombre}</td>
            <td>S/. ${productoActual.precio}</td>
            <td><a href="#" class="borrar-producto">X</a></td>
        `;
        carrito.appendChild(fila);
    }

    cerrarModalProducto();
    alert("Producto agregado al carrito ✅");
});
