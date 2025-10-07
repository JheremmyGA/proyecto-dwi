package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.repository.ProductMainRepository;

@Service
public class ProductHighlightService {
    @Autowired
    public ProductMainRepository productsMainRepository;

    public Optional<List<ProductMain>> GetBestSelling(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }

    public Optional<List<ProductMain>> GetLiquidation(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }

    public Optional<List<ProductMain>> GetTrending(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }

    public Optional<List<ProductMain>> GetNews(){
        return Optional.ofNullable(productsMainRepository.findAll().stream()
                                         .limit(5) // take at most 5 elements
                                         .collect(Collectors.toList()));
    }
}
