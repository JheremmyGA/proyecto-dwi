package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Talla;
import com.dwi.icommerce.repository.TallaRepository;

@Service
public class TallaService {
    @Autowired
    private TallaRepository repository;
    
    public List<Talla> GetAll(){
        return repository.findAll();
    }

    public Optional<Talla> GetById(Long id){
        return repository.findById(id);
    }

    public Talla Create(Talla new_Talla){
        if(new_Talla.getNombre() != "") {
            return repository.save(new_Talla);
        }
        return new Talla();
    }

    public boolean Delete(Talla update_Talla){
        repository.delete(update_Talla);
        return true;
    }
}
