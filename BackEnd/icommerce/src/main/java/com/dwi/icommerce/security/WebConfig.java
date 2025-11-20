package com.dwi.icommerce.security;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir; // Obtiene: src/main/resources/static/images/uploads

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        
        // 1. Mapear la URL /images/** a la ruta física de subidas
        // Usamos "file:" + ruta absoluta, que es mucho más fiable que las rutas relativas.
        // El 'uploadDir' debe terminar en '/', por eso resolvemos el Path.
        String absolutePath = Paths.get(uploadDir).toAbsolutePath().toString();
        
        registry.addResourceHandler("/images/**")
                // Mapea la URL /images/ a la carpeta física exacta donde se guardan los archivos
                .addResourceLocations("file:" + absolutePath + "/"); 

        // 2. Asegurarse de que otros recursos estáticos (CSS/JS) se sigan sirviendo
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}