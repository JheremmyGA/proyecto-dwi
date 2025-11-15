package com.dwi.icommerce.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenResponseDTO {
    @JsonProperty("id_usuario")
    public Long id;
    @JsonProperty("access_token")
    public String accessToken;
    @JsonProperty("refresh_token")
    public String refreshToken;
    @JsonProperty("role")
    public String role;

    public TokenResponseDTO(Long idUsuario, String accessToken, String refreshToken, String roles){
        this.id = idUsuario;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = roles;
    }

    public TokenResponseDTO()
    {
        
    }
}
