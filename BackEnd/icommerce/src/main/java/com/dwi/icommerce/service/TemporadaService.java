package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Temporada;
import com.dwi.icommerce.repository.TemporadaRepository;

@Service
public class TemporadaService {
    @Autowired
    private TemporadaRepository temporada_repository;
    
    public List<Temporada> GetAll(){
        return temporada_repository.findAll();
    }

    public Optional<Temporada> GetById(Long id){
        return temporada_repository.findById(id);
    }

    public Temporada findByNombre(String nombre){
        Optional<Temporada> element =  temporada_repository.findByNombre(nombre);
        if ((element.isPresent())) {
            return element.get();
        }
        else return Create(new Temporada(nombre));
    }

    public Temporada Create(Temporada new_Categoria){
        if(new_Categoria.getNombre() != "") {
            return temporada_repository.save(new_Categoria);
        }
        return new Temporada();
    }

    public boolean Delete(Temporada update_categoria){
        temporada_repository.delete(update_categoria);
        return true;
    }
}
