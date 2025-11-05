/**
 * login.js actualizado FINAL
 * - Admin: admin@kivora.com / admin1234
 * - Ambos (admin y usuarios normales) redirigen a index.html
 * - Si es admin, al volver al index se muestra "Panel Admin"
 */

const ADMIN_CORREO = 'admin@kivora.com';
const ADMIN_PASS = 'admin1234';
const MIN_LENGTH = 3;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const mensajeError = document.getElementById('mensaje-error');

    // =========================================================
    // INICIO DE SESIÓN
    // =========================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const correoInput = document.getElementById('correo').value.trim();
            const contrasenaInput = document.getElementById('contrasena').value.trim();

            let nombre = '';
            let rol = '';
            let loginExitoso = false;
            let mensaje = '';

            if (!correoInput || !contrasenaInput) {
                mensaje = 'Por favor, ingrese correo y contraseña.';
            } 
            else if (correoInput === ADMIN_CORREO && contrasenaInput === ADMIN_PASS) {
                nombre = 'Administrador KIVORA';
                rol = 'admin';
                loginExitoso = true;
            } 
            else if (correoInput.length >= MIN_LENGTH && contrasenaInput.length >= MIN_LENGTH) {
                nombre = correoInput.split('@')[0] || 'Usuario';
                rol = 'user';
                loginExitoso = true;
            } 
            else {
                mensaje = 'Credenciales incorrectas o incompletas.';
            }

            if (loginExitoso) {
                const usuario = { nombre, correo: correoInput, rol };
                localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

                // 🔹 Siempre redirige al index (sin importar el rol)
                window.location.href = 'index.html';
            } else {
                mensajeError ? mensajeError.textContent = mensaje : alert(mensaje);
            }
        });
    }

    // =========================================================
    // MOSTRAR NOMBRE + MENÚ DESPLEGABLE + BOTÓN ADMIN SI APLICA
    // =========================================================
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    const contAnonimo = document.getElementById('contenedor-anonimo');
    const contLogueado = document.getElementById('contenedor-logueado');
    const nombreUsuario = document.getElementById('nombre-usuario');
    const menuUsuario = document.querySelector('.usuario-menu');

    if (usuarioLogueado && contAnonimo && contLogueado && nombreUsuario) {
        contAnonimo.style.display = 'none';
        contLogueado.style.display = 'flex';
        nombreUsuario.textContent = `Hola, ${usuarioLogueado.nombre} `;

        // Limpiar el menú antes de construirlo
        if (menuUsuario) {
            menuUsuario.innerHTML = `
                <a href="Usuario.html">Mi cuenta</a>
                <a href="#">Mis CMR Puntos</a>
                <a href="carrito.html">Mi carrito</a>
                <a href="#" onclick="cerrarSesion()">Cerrar sesión</a>
            `;

            // 🔹 Si es administrador, agrega el botón "Panel Admin"
            if (usuarioLogueado.rol === 'admin') {
                const enlaceAdmin = document.createElement('a');
                enlaceAdmin.href = 'Administrador.html';
                enlaceAdmin.textContent = 'Panel Admin';
                enlaceAdmin.id = 'boton-admin';
                menuUsuario.insertBefore(enlaceAdmin, menuUsuario.firstChild);
            }
        }
    }
});

// =========================================================
// CERRAR SESIÓN
// =========================================================
function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html';
}
window.cerrarSesion = cerrarSesion;

// =========================================================
// DESPLEGABLE DEL USUARIO
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.usuario-dropdown');
    const botonUsuario = document.querySelector('.usuario-btn');

    if (dropdown && botonUsuario) {
        botonUsuario.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('activo');
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('activo');
        });
    }
});
