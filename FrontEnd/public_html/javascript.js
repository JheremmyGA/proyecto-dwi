function mostrarMitienda() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("Mi-Tienda").style.display = "block";
}


function mostrarNosotros() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("Nosotros").style.display = "block";
}

function mostrarCatalogo() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("Mi-Tienda").style.display = "block";
}

function ocultarTodasLasSecciones() {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('Mi-Tienda').style.display = 'none';
    document.getElementById('Nosotros').style.display = 'none';
    document.getElementById('Catálogo').style.display = 'none';
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('Contacto').style.display = 'none';
}

function mostrarSeccion(seccionId) {
    ocultarTodasLasSecciones();
    document.getElementById(seccionId).style.display = 'block';
}


function regresarInicio() {
    document.getElementById("inicio").style.display = "block";
    document.getElementById("Nosotros").style.display = "none";
}

//carrusel

function scrollCarrusel(id, direccion) {
    const carrusel = document.getElementById(id);
    const desplazamiento = 250; // píxeles a mover

    if (carrusel) {
        carrusel.scrollBy({
            left: direccion * desplazamiento,
            behavior: 'smooth'
        });
    }
}



const images = document.querySelectorAll('.hero img');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

let current = 0;

function showImage(index) {
    images.forEach((img, i) => {
        img.classList.remove('active');
    });
    images[index].classList.add('active');
}

rightArrow.addEventListener('click', () => {
    current = (current + 1) % images.length;
    showImage(current);
});

leftArrow.addEventListener('click', () => {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
});

showImage(current); // Asegura que una imagen se muestre al cargar


function regresarInicio() {
    document.getElementById("inicio").style.display = "block";
    document.getElementById("Nosotros").style.display = "none";
    document.getElementById("Mi-Tienda").style.display = "none";
    document.getElementById("Catálogo").style.display = "none";
    document.getElementById("Contacto").style.display = "none";

    // Desplaza la página al inicio
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function mostrarModalLogin() {
    document.getElementById("modalLogin").style.display = "flex";
}

function cerrarModalLogin() {
    document.getElementById("modalLogin").style.display = "none";
}



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



// Características de los productos
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


// Mostrar info del producto al hacer clic
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

            productoActual = {
                id,
                nombre,
                precio,
                imagen
            };

            const lista = document.getElementById("modalCaracteristicas");
            lista.innerHTML = ""; // limpia el contenido anterior

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

let productoActual = {}; // almacena el producto que se muestra en el modal

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

    // Opcional: cerrar modal después de comprar
    cerrarModalProducto();

    // Opcional: mostrar alerta temporal
    alert("Producto agregado al carrito ✅");
});



// Mostrar/ocultar modales
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

// Guardar usuario en localStorage
function registrarUsuario() {
    const usuario = document.getElementById("registroUsuario").value.trim();
    const clave = document.getElementById("registroClave").value.trim();

    if (!usuario || !clave) {
        alert("Complete todos los campos");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find(u => u.usuario === usuario);

    if (existe) {
        alert("El usuario ya existe");
        return;
    }

    usuarios.push({usuario, clave});
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("¡Registro exitoso!");
    cerrarModalRegistro();
    mostrarModalLogin();
}

// Iniciar sesión
function iniciarSesion() {
    const usuario = document.getElementById("loginUsuario").value.trim();
    const clave = document.getElementById("loginClave").value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find(u => u.usuario === usuario && u.clave === clave);

    if (existe) {
        localStorage.setItem("usuarioActivo", usuario);
        actualizarEstadoSesion();
        cerrarModalLogin();
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

// Mostrar mensaje si está logueado
function actualizarEstadoSesion() {
    const activo = localStorage.getItem("usuarioActivo");
    const btnLogin = document.querySelector(".btn-login");

    if (activo) {
        btnLogin.innerHTML = `
  <span style="font-weight: 500;">Hola, ${activo}</span>
  <button class="btn-cerrar-sesion" onclick="cerrarSesion()">Cerrar sesión</button>
`;

    } else {
        btnLogin.innerHTML = `<button onclick="mostrarModalLogin()">Iniciar sesión</button>`;
    }
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    actualizarEstadoSesion();
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", actualizarEstadoSesion);
