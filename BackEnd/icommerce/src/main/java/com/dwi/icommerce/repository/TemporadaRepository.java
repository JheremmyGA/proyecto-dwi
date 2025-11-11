package com.dwi.icommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dwi.icommerce.model.Temporada;

public interface TemporadaRepository extends JpaRepository<Temporada, Long>{
    public Optional<Temporada> findByNombre(String nombre);
}
