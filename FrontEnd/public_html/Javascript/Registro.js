/**
 * registro.js
 * Maneja la lógica de la página de Registro.
 */

document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');

    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Obtener los valores de los campos
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const correo = document.getElementById('correo_registro').value.trim();
            const contrasena = document.getElementById('contrasena_registro').value.trim();
            
            const nombreCompleto = `${nombre} ${apellido}`;

            // 2. Validación básica (verificar que todos los campos estén llenos)
            if (nombre && apellido && correo && contrasena) {
                
                // REGISTRO EXITOSO (SIMULADO):
                
                // NOTA: En un sistema real, aquí se enviarían los datos a un servidor.
                
                // 3. Iniciar sesión automáticamente tras el registro
                localStorage.setItem('usuarioLogeado', 'true');
                localStorage.setItem('nombreUsuario', nombreCompleto); 

                // **Se omite el alert para una experiencia de usuario más limpia.**
                
                // 4. Redirigir a la página principal
                window.location.href = 'index.html';

            } else {
                // Mensaje simple si falta algún campo
                alert('Por favor, completa todos los campos para registrarte.');
            }
        });
    }
});