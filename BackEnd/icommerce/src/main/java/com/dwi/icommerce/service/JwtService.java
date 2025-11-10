package com.dwi.icommerce.service;

import java.util.Date;
import java.util.Map;
import java.util.Base64.Decoder;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret-key}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    @Value("${jwt.refresh-token-expiration}")
    private long refreshExpiration;

    public String generateToken(final Usuario user){
        return buildToken(user, jwtExpiration);
    }

    public String generateRefreshToken(final Usuario user){
        return buildToken(user, refreshExpiration);
    }

    private String buildToken(final Usuario user, final Long expiration){
        return Jwts.builder()
                .setId(user.getId().toString())
                .setClaims(Map.of("name",user.getNombre() + user.getApellido()))
                .setSubject(user.getCorreo())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+expiration))
                .signWith(GetSignInKey())
                .compact();
    }

    private SecretKey GetSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
