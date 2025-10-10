package com.dwi.icommerce.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.DTO.RegisterUsuarioDTO;
import com.dwi.icommerce.model.Usuario;
import com.dwi.icommerce.repository.UsuarioRepository;

@Service
public class UsuarioAuthService {

    @Autowired
    public final UsuarioRepository repository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public UsuarioAuthService(UsuarioRepository repository){
        this.repository = repository;
    }

    public Optional<Usuario> findUsuarioByEmail(String email){
        return repository.findByCorreo(email);
    }

    public void CreateUsuario(RegisterUsuarioDTO data){
        Usuario newUser = new Usuario(data);
        String newContraseña = passwordEncoder.encode(data.getContraseña());
        newUser.setContraseña(newContraseña);
        repository.save(newUser);
    }
}
