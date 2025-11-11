import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

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
                const UserData = {
                    nombre: nombre,
                    apellido: apellido,
                    correo: correo,
                    contraseña: contrasena
                };
                Register(UserData);

            } else {
                // Mensaje simple si falta algún campo
                alert('Por favor, completa todos los campos para registrarte.');
            }
        });
    }
});

async function Register(UserData){
    const TokenData = await HTTPS_Request.Registro(UserData);
    console.error(TokenData);

    if (TokenData === null) {
        console.log("Registro fallido o incompleto. No se intentará iniciar sesión.");
        return; 
    }

    //localStorage.setItem('usuarioLogeado', 'true');
    PERSISTENT_DATA.SetNombreUsuario(UserData.nombre);
    PERSISTENT_DATA.SetTokenData(TokenData.access_token);
    PERSISTENT_DATA.SetUsuarioLogeado('true');
    PERSISTENT_DATA.SetRol(TokenData.role);

    window.location.href = 'index.html';
}