package com.dwi.icommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Order;
import com.dwi.icommerce.model.OrderDetails;
import com.dwi.icommerce.model.ShoppingCart;
import com.dwi.icommerce.repository.OrderDetailsRepository;

@Service
public class OrderDetailsService {

    @Autowired
    private final OrderDetailsRepository repository;

    public OrderDetailsService(OrderDetailsRepository repository){
        this.repository = repository;
    }

    public void SaveOrderDetails(Order order, List<ShoppingCart> userShopping){
        for (ShoppingCart shoppingCart : userShopping) {
            OrderDetails detail = new OrderDetails();

            detail.setCantidad(shoppingCart.getCantidad());
            detail.setPedido(order);
            detail.setPrecio(shoppingCart.getPrecio());
            detail.setProducto(shoppingCart.getProductoMain());

            repository.save(detail);
        }
    }

    public List<OrderDetails> GetAllOrdersDetails(){
        return repository.findAll();
    } 
}
