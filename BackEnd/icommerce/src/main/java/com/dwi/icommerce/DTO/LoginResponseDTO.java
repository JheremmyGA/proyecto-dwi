package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.Usuario;

public class LoginResponseDTO {
    private final Long id;
    private final String token;
    private final String correo;

    public LoginResponseDTO(Usuario usuario){
        this.id = usuario.getId();
        this.token = "";
        this.correo = usuario.getCorreo();
    }

    public String getCorreo() {
        return correo;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }
}
