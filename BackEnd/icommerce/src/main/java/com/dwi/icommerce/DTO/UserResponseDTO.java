package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.Usuario;

public class UserResponseDTO {

    public final String nombre;
    public final String apellido;
    public final String correo;

    public UserResponseDTO(Usuario usuario){
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.correo = usuario.getCorreo();
    }
}
