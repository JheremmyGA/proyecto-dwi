package com.dwi.icommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Categoria;

@Repository
public interface CategoriaRepository extends  JpaRepository<Categoria, Long> {

}
