package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Categoria;
import com.dwi.icommerce.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoria_repository;
    
    public List<Categoria> GetAllCategorias(){
        return categoria_repository.findAll();
    }

    public Optional<Categoria> GetCategoriaById(Long id){
        return categoria_repository.findById(id);
    }

    public Categoria CreateCategoria(Categoria new_Categoria){
        if(new_Categoria.getNombre() != "" && new_Categoria.getDescripcion() != "") {
            return categoria_repository.save(new_Categoria);
        }
        return new Categoria();
    }

    public boolean DeleteCategoria(Categoria update_categoria){
        categoria_repository.delete(update_categoria);
        return true;
    }
}
