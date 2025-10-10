package com.dwi.icommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Usuario;

@Repository
public interface UsuarioRepository extends  JpaRepository<Usuario, Long> {
    public Optional<Usuario> findByCorreo(String correo);
}
