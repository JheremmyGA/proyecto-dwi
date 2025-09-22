package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Genero;
import com.dwi.icommerce.repository.GeneroRepository;

@Service
public class GeneroService {
    @Autowired
    private GeneroRepository repository;
    
    public List<Genero> GetAll(){
        return repository.findAll();
    }

    public Optional<Genero> GetById(Long id){
        return repository.findById(id);
    }

    public Genero Create(Genero new_Categoria){
        if(new_Categoria.getNombre() != "") {
            return repository.save(new_Categoria);
        }
        return new Genero();
    }

    public boolean Delete(Genero update_categoria){
        repository.delete(update_categoria);
        return true;
    }
}
