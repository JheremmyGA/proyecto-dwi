package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Categoria;
import com.dwi.icommerce.model.Temporada;
import com.dwi.icommerce.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoria_repository;
    
    public List<Categoria> GetAll(){
        return categoria_repository.findAll();
    }

    public Optional<Categoria> GetById(Long id){
        return categoria_repository.findById(id);
    }

    public Categoria findByNombre(String nombre){
        Optional<Categoria> element =  categoria_repository.findByNombre(nombre);
        if ((element.isPresent())) {
            return element.get();
        }
        else return Create(new Categoria(nombre));
    }

    public Categoria Create(Categoria new_Categoria){
        if(new_Categoria.getNombre() != "" && new_Categoria.getDescripcion() != "") {
            return categoria_repository.save(new_Categoria);
        }
        return new Categoria();
    }

    public boolean Delete(Categoria update_categoria){
        categoria_repository.delete(update_categoria);
        return true;
    }
}
