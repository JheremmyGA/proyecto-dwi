package com.dwi.icommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dwi.icommerce.model.Marca;


public interface MarcaRepository extends  JpaRepository<Marca, Long> {
    public Optional<Marca> findByNombre(String nombre);
}
