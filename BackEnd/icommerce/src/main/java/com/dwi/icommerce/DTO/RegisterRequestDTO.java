package com.dwi.icommerce.DTO;

public class RegisterRequestDTO {
    private final String nombre;
    private final String apellido;
    private final String correo;
    private final String contraseña;

    public RegisterRequestDTO(String apellido, String contraseña, String correo, String nombre) {
        this.apellido = apellido;
        this.contraseña = contraseña;
        this.correo = correo;
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getContraseña() {
        return contraseña;
    }
}
