package com.dwi.icommerce.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/images/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new org.springframework.web.servlet.resource.PathResourceResolver());
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/images/uploads/**")
                .allowedOrigins("*")            // o el dominio de tu front
                .allowedMethods("GET")
                .allowedHeaders("*")
                .exposedHeaders(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
    }
}
