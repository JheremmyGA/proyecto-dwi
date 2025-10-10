package com.dwi.icommerce.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Usuario;
import com.dwi.icommerce.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    public final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository){
        this.repository = repository;
    }

    public Optional<Usuario> findUsuario(Long id){
        return repository.findById(id);
    }
    
}
