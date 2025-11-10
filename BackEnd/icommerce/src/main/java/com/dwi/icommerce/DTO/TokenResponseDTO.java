package com.dwi.icommerce.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenResponseDTO {
    @JsonProperty("access_token")
    public String accessToken;
    @JsonProperty("refresh_token")
    public String refreshToken;

    public TokenResponseDTO(String accessToken, String refreshToken){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public TokenResponseDTO()
    {
        
    }
}
