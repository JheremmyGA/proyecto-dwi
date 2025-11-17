package com.dwi.icommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.OrderDetailRequestDTO;
import com.dwi.icommerce.DTO.SalesDetailsReponseDTO;
import com.dwi.icommerce.DTO.ShoppingCartDTO;
import com.dwi.icommerce.service.OrderService;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/order")
public class OrderController {
    @Autowired
    private final OrderService service;
    
    public OrderController(OrderService service){
        this.service = service;
    }

    @PostMapping("/takeorder/{id}")
    public ResponseEntity<ShoppingCartDTO> TakeOrder(@PathVariable Long id, @RequestBody OrderDetailRequestDTO oDetailRequestDTO) {
        service.TakeOrder(id, oDetailRequestDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/sales/all")
    public ResponseEntity<List<SalesDetailsReponseDTO>> AllSalesDetails() {
        List<SalesDetailsReponseDTO> response = service.GetAllSalesDetails();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
