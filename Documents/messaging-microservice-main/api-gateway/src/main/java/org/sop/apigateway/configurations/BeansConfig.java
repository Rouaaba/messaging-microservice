package org.sop.apigateway.configurations;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.server.resource.web.reactive.function.client.ServerBearerExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class BeansConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    // WebClient configuration to automatically pass the Bearer token from the SecurityContext
    @Bean
    public WebClient webClient() {
        ServerBearerExchangeFilterFunction bearerFilter = new ServerBearerExchangeFilterFunction();
        
        return WebClient.builder()
                .filter(bearerFilter) // Automatically injects the Bearer token
                .build();
    }
}
