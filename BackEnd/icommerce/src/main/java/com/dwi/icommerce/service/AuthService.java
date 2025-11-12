package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.DTO.LoginRequestDTO;
import com.dwi.icommerce.DTO.RegisterRequestDTO;
import com.dwi.icommerce.DTO.TokenResponseDTO;
import com.dwi.icommerce.Enums.UsuarioRol;
import com.dwi.icommerce.model.Token;
import com.dwi.icommerce.model.Usuario;
import com.dwi.icommerce.repository.TokenRepository;
import com.dwi.icommerce.repository.UsuarioRepository;

@Service
public class AuthService {

    @Autowired
    public final UsuarioRepository repository;
    @Autowired
    public final TokenRepository tokenRepository;

    private final BCryptPasswordEncoder enconder = new BCryptPasswordEncoder();

    @Autowired
    public final JwtService jwtService;

    public AuthService(UsuarioRepository repository, TokenRepository tokenRepository, JwtService jwtService){
        this.repository = repository;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
    }

    public TokenResponseDTO Register(RegisterRequestDTO data){
        Usuario user = new Usuario();
        user.setNombre(data.getNombre());
        user.setApellido(data.getApellido());
        user.setCorreo(data.getCorreo());
        user.setContraseña(enconder.encode(data.getContraseña()));
        user.setRol(UsuarioRol.Cliente);

        Usuario usuarioSave = repository.save(user);
        var jwtToken = jwtService.generateToken(usuarioSave);
        var refreshToken = jwtService.generateRefreshToken(usuarioSave);

        SaveUserToken(usuarioSave, jwtToken);

        return new TokenResponseDTO(jwtToken,refreshToken, usuarioSave.getRol().toString());
    }

    private void SaveUserToken(Usuario user, String jwtToken){
        Token token = new Token();
        token.setUsuario(user);
        token.setToken(jwtToken);
        token.setTokenType(Token.TokenType.BEARER);
        token.setExpired(false);
        token.setRevoked(false);
        tokenRepository.save(token);
    }

    public TokenResponseDTO Login(LoginRequestDTO data){

        Optional<Usuario> userFind = repository.findByCorreo(data.getCorreo());
        if (userFind.isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado con el correo: " + data.getCorreo());
        }

        var jwtToken = jwtService.generateToken(userFind.get());
        var refreshToken = jwtService.generateRefreshToken(userFind.get());
        RevokeAllUserTokens(userFind.get());
        SaveUserToken(userFind.get(), jwtToken);

        return new TokenResponseDTO(jwtToken, refreshToken, userFind.get().getRol().toString());
    }

    private void RevokeAllUserTokens(Usuario user){
        final List<Token> validUserTokens = tokenRepository.findAllValidIsFalseOrRevokedIsFalseByUsuarioId(user.getId());

        if (!validUserTokens.isEmpty()) {
            for(final Token token : validUserTokens){
                token.setExpired(true);
                token.setRevoked(true);
            }

            tokenRepository.saveAll(validUserTokens);
        }
    }

    //bearerpublic TokenResponse DTO Refresh(String authHeader){
    //bearer    return new TokenResponseDTO();
    //bearer}
}