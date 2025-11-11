package com.dwi.icommerce.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenResponseDTO {
    @JsonProperty("access_token")
    public String accessToken;
    @JsonProperty("refresh_token")
    public String refreshToken;
    @JsonProperty("role")
    public String role;

    public TokenResponseDTO(String accessToken, String refreshToken, String roles){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = roles;
    }

    public TokenResponseDTO()
    {
        
    }
}
