package com.dwi.icommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dwi.icommerce.model.Talla;

public interface TallaRepository extends JpaRepository<Talla, Long> {
    public Optional<Talla> findByNombre(String nombre);
}
