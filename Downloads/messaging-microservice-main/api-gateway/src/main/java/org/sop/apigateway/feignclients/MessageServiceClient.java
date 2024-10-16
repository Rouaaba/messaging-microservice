package org.sop.apigateway.feignclients;

import java.util.List;

import org.sop.apigateway.models.Message;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "message-service")
public interface MessageServiceClient {

    @PostMapping("/messages")
    Message sendMessage(@RequestBody Message message);

    @GetMapping("/messages/between/{senderId}/{recipientId}")
    List<Message> getMessagesBetweenUsers(@PathVariable("senderId") Long senderId, 
                                          @PathVariable("recipientId") Long recipientId);
}
