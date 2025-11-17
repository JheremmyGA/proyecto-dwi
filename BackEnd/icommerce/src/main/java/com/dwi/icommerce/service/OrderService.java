package com.dwi.icommerce.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.DTO.OrderDetailRequestDTO;
import com.dwi.icommerce.DTO.SalesDetailsReponseDTO;
import com.dwi.icommerce.model.Order;
import com.dwi.icommerce.model.OrderDetails;
import com.dwi.icommerce.model.ShoppingCart;
import com.dwi.icommerce.repository.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private final OrderRepository repository;
    @Autowired
    private final ProductMainService productMainService;
    @Autowired
    private final OrderDetailsService orderDetailsService;
    @Autowired
    private final ShoppingCartService shoppingCartService;

    public OrderService(OrderRepository repository, ProductMainService productMainService,OrderDetailsService orderDetailsService, ShoppingCartService shoppingCartService){
        this.repository = repository;
        this.productMainService = productMainService;
        this.orderDetailsService = orderDetailsService;
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
        newOrder.setEstado("Pagado");
        newOrder.setFecha(LocalDateTime.now(ZoneId.of("America/Lima")));
        newOrder.setMetodo(oDetailRequestDTO.metodo);
        newOrder.setTelefono(oDetailRequestDTO.telefono);
        newOrder.setTotal(total);
        newOrder.setUsuario(userShopping.get(0).getUsuario());

        productMainService.TakeOrder(userShopping);
        orderDetailsService.SaveOrderDetails(repository.save(newOrder), userShopping);
        shoppingCartService.DeleteItems(usuarioID);
    }

    public List<SalesDetailsReponseDTO> GetAllSalesDetails(){

        List<SalesDetailsReponseDTO> responseDTOs = new ArrayList<>();
        List<OrderDetails> ordersDetails = orderDetailsService.GetAllOrdersDetails();
        
        for (OrderDetails oDetails : ordersDetails) {
            SalesDetailsReponseDTO response = new SalesDetailsReponseDTO(oDetails);
            responseDTOs.add(response);
        }

        return responseDTOs;
    }
}
