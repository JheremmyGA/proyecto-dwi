package com.dwi.icommerce.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.LoginRequestDTO;
import com.dwi.icommerce.DTO.RegisterRequestDTO;
import com.dwi.icommerce.DTO.TokenResponseDTO;
import com.dwi.icommerce.DTO.UserResponseDTO;
import com.dwi.icommerce.service.AuthService;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    public final AuthService service;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public AuthController (AuthService service){
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponseDTO> Register(@RequestBody final RegisterRequestDTO data) {
        logger.error(data.toString());
        final TokenResponseDTO token = service.Register(data);
        return ResponseEntity.ok(token);
    }
    
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> Login(@RequestBody LoginRequestDTO loginData) {
        final TokenResponseDTO token = service.Login(loginData);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findUserDTO(@PathVariable Long id) {
        final UserResponseDTO userResponseDTO = service.GetUserDTO(id);
        return ResponseEntity.ok(userResponseDTO);
    }

    //@PostMapping("/refresh")
    //public ResponseEntity<TokenResponseDTO> Refresh(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader) {
    //    final TokenResponseDTO token = service.Refresh(authHeader);
    //    return ResponseEntity.ok(token);
    //}
}