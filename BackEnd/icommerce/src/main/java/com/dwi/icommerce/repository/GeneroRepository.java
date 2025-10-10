package com.dwi.icommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dwi.icommerce.model.Genero;

public interface GeneroRepository extends  JpaRepository<Genero, Long>{
    public Optional<Genero> findByNombre(String nombre);
}
