package com.dwi.icommerce.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.DTO.OrderDetailRequestDTO;
import com.dwi.icommerce.model.Order;
import com.dwi.icommerce.model.ShoppingCart;
import com.dwi.icommerce.repository.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private final OrderRepository repository;
    @Autowired
    private final ShoppingCartService shoppingCartService;

    public OrderService(OrderRepository repository, ShoppingCartService shoppingCartService){
        this.repository = repository;
        this.shoppingCartService = shoppingCartService;
    }

    public void TakeOrder(Long usuarioID, OrderDetailRequestDTO oDetailRequestDTO){
        Optional<List<ShoppingCart>> userShoppingOptional = shoppingCartService.FindByUsuario(usuarioID);

        if (userShoppingOptional.isEmpty()) {
            throw new NoSuchElementException("El usuario no tiene elementos en su carrito");
        }

        List<ShoppingCart> userShopping = userShoppingOptional.get();

        double total = userShopping.stream() 
            .mapToDouble(ShoppingCart::getPrecio)
            .sum();

        Order newOrder = new Order();
        newOrder.setDireccion(oDetailRequestDTO.direccion);
        newOrder.setEstado("");
        newOrder.setFecha(LocalDateTime.now(ZoneId.of("America/Lima")));
        newOrder.setMetodo(oDetailRequestDTO.metodo);
        newOrder.setTelefono(oDetailRequestDTO.telefono);
        newOrder.setTotal(total);
        newOrder.setUsuario(userShopping.get(0).getUsuario());

        repository.save(newOrder);

        // Falta colocar los detalles
        
    }
}
