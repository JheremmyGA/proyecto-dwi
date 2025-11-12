package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Marca;
import com.dwi.icommerce.repository.MarcaRepository;

@Service
public class MarcaService {
    @Autowired
    private MarcaRepository repository;
    
    public List<Marca> GetAll(){
        return repository.findAll();
    }

    public Optional<Marca> GetById(Long id){
        return repository.findById(id);
    }

    public Marca findByNombre(String nombre){
        Optional<Marca> element =  repository.findByNombre(nombre);
        if ((element.isPresent())) {
            return element.get();
        }
        else return Create(new Marca(nombre));
    }

    public Marca Create(Marca new_Categoria){
        if(new_Categoria.getNombre() != "") {
            return repository.save(new_Categoria);
        }
        return new Marca();
    }

    public boolean Delete(Marca update_Marca){
        repository.delete(update_Marca);
        return true;
    }
}
