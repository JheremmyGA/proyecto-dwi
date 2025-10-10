package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Color;
import com.dwi.icommerce.repository.ColorRepository;

@Service
public class ColorService {
    @Autowired
    private ColorRepository repository;
    
    public List<Color> GetAll(){
        return repository.findAll();
    }

    public Optional<Color> GetById(Long id){
        return repository.findById(id);
    }

    public Optional<Color> GetByName(String name){
        return repository.findByNombre(name);
    }

    public Color Create(Color new_color){
        if(new_color.getNombre() != "") {
            return repository.save(new_color);
        }
        return new Color();
    }

    public boolean Delete(Color update_Color){
        repository.delete(update_Color);
        return true;
    }
}
