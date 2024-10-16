package com.app.messaging.feignclients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.app.messaging.dtos.UserDTO;

@FeignClient(name = "API-GATEWAY", path = "http://172.25.0.7:8080/api/user")
public interface ApiGatewayUserClient {

    @GetMapping("/friends/{userId}")
    List<UserDTO> findFriends(@PathVariable("userId") Long userId); // Add this method to get friends
}
