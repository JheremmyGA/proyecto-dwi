package com.dwi.icommerce.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.LoginRequestDTO;
import com.dwi.icommerce.DTO.LoginResponseDTO;
import com.dwi.icommerce.DTO.RegisterUsuarioDTO;
import com.dwi.icommerce.model.Usuario;
import com.dwi.icommerce.service.UsuarioAuthService;


@RestController
@RequestMapping("/api/auth")
public class UsuarioAuthController {

    @Autowired
    public final UsuarioAuthService service;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioAuthController (UsuarioAuthService service){
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<?> RegisterUsuario(@RequestBody RegisterUsuarioDTO data) {
        
        if(service.findUsuarioByEmail(data.getCorreo()).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ya existe.");
        }

        service.CreateUsuario(data);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado exitosamente.");
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> LoginUsusario(@RequestBody LoginRequestDTO loginData) {
        Optional<Usuario> usuario = service.findUsuarioByEmail(loginData.getCorreo());

        if(usuario.isPresent()){
            if (passwordEncoder.matches(loginData.getContraseña(), usuario.get().getContraseña())) {
                return ResponseEntity.status(HttpStatus.OK).body(new LoginResponseDTO(usuario.get()));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
