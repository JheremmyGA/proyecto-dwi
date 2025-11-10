package com.dwi.icommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.LoginRequestDTO;
import com.dwi.icommerce.DTO.RegisterRequestDTO;
import com.dwi.icommerce.DTO.TokenResponseDTO;
import com.dwi.icommerce.service.AuthService;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    public final AuthService service;

    public AuthController (AuthService service){
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponseDTO> Register(@RequestBody final RegisterRequestDTO data) {
        final TokenResponseDTO token = service.Register(data);
        return ResponseEntity.ok(token);
    }
    
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> Login(@RequestBody LoginRequestDTO loginData) {
        final TokenResponseDTO token = service.Login(loginData);
        return ResponseEntity.ok(token);
    }

    //@PostMapping("/refresh")
    //public ResponseEntity<TokenResponseDTO> Refresh(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader) {
    //    final TokenResponseDTO token = service.Refresh(authHeader);
    //    return ResponseEntity.ok(token);
    //}
}