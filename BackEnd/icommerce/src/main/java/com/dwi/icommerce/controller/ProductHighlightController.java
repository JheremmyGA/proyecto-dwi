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

import com.dwi.icommerce.DTO.SoftMainProductDTO;
import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.service.ProductHighlightService;


@RestController
@RequestMapping("/api/catalog")
public class ProductHighlightController {

    @Autowired
    public final ProductHighlightService service;

    public ProductHighlightController(ProductHighlightService service){
        this.service = service;
    }

    @GetMapping("/best-selling")
    public ResponseEntity<List<SoftMainProductDTO>> GetBestSelling() {
        Optional<List<ProductMain>> productsFind = service.GetBestSelling();
        return GetAnswerAPI(productsFind);
    }

    @GetMapping("/liquidation")
    public ResponseEntity<List<SoftMainProductDTO>> GetLiquidation() {
        Optional<List<ProductMain>> productsFind = service.GetLiquidation();
        return GetAnswerAPI(productsFind);
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<SoftMainProductDTO>> GetTrending() {
        Optional<List<ProductMain>> productsFind = service.GetTrending();
        return GetAnswerAPI(productsFind);
    }

    @GetMapping("/news")
    public ResponseEntity<List<SoftMainProductDTO>> GetNews() {
        Optional<List<ProductMain>> productsFind = service.GetTrending();
        return GetAnswerAPI(productsFind);
    }

    private ResponseEntity<List<SoftMainProductDTO>> GetAnswerAPI(Optional<List<ProductMain>> dataCheck){
        if(dataCheck.isEmpty()) ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<SoftMainProductDTO> listaFinal = dataCheck.get().stream()
            .map(a -> new SoftMainProductDTO(a))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.FOUND).body(listaFinal);
    }
}
