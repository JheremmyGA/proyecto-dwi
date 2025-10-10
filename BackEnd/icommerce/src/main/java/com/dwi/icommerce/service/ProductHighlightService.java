package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Producto;
import com.dwi.icommerce.repository.ProductoRepository;

@Service
public class ProductHighlightService {
    @Autowired
    public ProductoRepository productsMainRepository;

    public Optional<List<Producto>> GetBestSelling(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }

    public Optional<List<Producto>> GetLiquidation(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }

    public Optional<List<Producto>> GetTrending(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }

    public Optional<List<Producto>> GetNews(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }
}
