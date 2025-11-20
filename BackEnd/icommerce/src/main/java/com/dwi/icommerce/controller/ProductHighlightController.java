package com.dwi.icommerce.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.SoftCatalogProductDTO;
import com.dwi.icommerce.model.Producto;
import com.dwi.icommerce.service.ProductHighlightService;


@RestController
@RequestMapping("/api/tendencies")
public class ProductHighlightController {

    @Autowired
    public final ProductHighlightService service;

    public ProductHighlightController(ProductHighlightService service){
        this.service = service;
    }

    @GetMapping("/best-selling")
    public ResponseEntity<List<SoftCatalogProductDTO>> GetBestSelling() {
        Optional<List<Producto>> productsFind = service.GetBestSelling();
        return GetAnswerAPI(productsFind);
    }

    @GetMapping("/liquidation")
    public ResponseEntity<List<SoftCatalogProductDTO>> GetLiquidation() {
        Optional<List<Producto>> productsFind = service.GetLiquidation();
        return GetAnswerAPI(productsFind);
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<SoftCatalogProductDTO>> GetTrending() {
        Optional<List<Producto>> productsFind = service.GetTrending();
        return GetAnswerAPI(productsFind);
    }

    @GetMapping("/news")
    public ResponseEntity<List<SoftCatalogProductDTO>> GetNews() {
        Optional<List<Producto>> productsFind = service.GetTrending();
        return GetAnswerAPI(productsFind);
    }

    private ResponseEntity<List<SoftCatalogProductDTO>> GetAnswerAPI(Optional<List<Producto>> dataCheck){
        if(dataCheck.isEmpty()) ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<SoftCatalogProductDTO> listaFinal = dataCheck.get().stream()
            .map(a -> new SoftCatalogProductDTO(a))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.FOUND).body(listaFinal);
    }
}
