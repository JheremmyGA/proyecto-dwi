/**
 * login.js
 * Modificado para:
 * 1. Permitir el ingreso con cualquier valor (sin validación estricta).
 * 2. Eliminar los mensajes flotantes (alerts) para una redirección silenciosa.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el formulario de Login
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        // 2. Escuchar el evento de envío del formulario
        loginForm.addEventListener('submit', (e) => {
            
            // Prevenir el comportamiento por defecto del formulario (evita la recarga)
            e.preventDefault();

            // Obtener los valores (aunque no se usarán para validación estricta, es bueno capturarlos)
            const correoInput = document.getElementById('correo').value.trim();
            // const contrasenaInput = document.getElementById('contrasena').value.trim(); // Ya no se necesita esta línea

            // =========================================================================
            // LÓGICA MODIFICADA: Ingreso libre sin importar las credenciales
            // Simplemente verificamos que el campo de correo no esté completamente vacío.
            // =========================================================================

            if (correoInput.length > 0) {
                
                // INICIO DE SESIÓN EXITOSO (SIMULADO):

                // 1. Almacenar el estado de la sesión
                localStorage.setItem('usuarioLogeado', 'true');
                localStorage.setItem('nombreUsuario', 'Usuario'); // Puedes usar un nombre genérico o el correo
                
                // **2. SE ELIMINA EL MENSAJE FLOTANTE (alert) AQUÍ.**
                // Antes: alert('Inicio de sesión exitoso. Redirigiendo a la página principal.');

                // 3. Redirigir a la página principal de forma inmediata
                window.location.href = 'index.html';

            } else {
                // Si el campo de correo está completamente vacío, damos un aviso simple.
                // **SE ELIMINA EL MENSAJE FLOTANTE GRUESO, se podría usar un mensaje in-page si se desea.**
                
                // Se mantiene un alert simple solo para indicar que no puede estar vacío.
                alert('El campo de correo electrónico no puede estar vacío.');
            }
        });
    }
});