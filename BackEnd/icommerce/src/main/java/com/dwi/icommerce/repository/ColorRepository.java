package com.dwi.icommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Color;

@Repository
public interface ColorRepository extends  JpaRepository<Color, Long>{
    public Optional<Color> findByNombre(String nombre);
}
