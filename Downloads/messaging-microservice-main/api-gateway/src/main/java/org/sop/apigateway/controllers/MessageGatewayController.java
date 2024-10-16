package org.sop.apigateway.controllers;

import java.util.List;

import org.sop.apigateway.feignclients.MessageServiceClient;
import org.sop.apigateway.models.Message;
import org.sop.apigateway.security.models.User;
import org.sop.apigateway.services.facade.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/message")
@Slf4j
public class MessageGatewayController {

    @Autowired
    private MessageServiceClient messageServiceClient;

    @Autowired
    private UserService userService; // Inject UserService to check friends

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        log.info("Sending message: {}", message);
        
        // Check if sender and recipient are friends before sending
        List<User> friends = userService.findFriends(message.getSenderId());
        boolean isFriend = friends.stream().anyMatch(friend -> friend.getId().equals(message.getRecipientId()));

        if (!isFriend) {
            log.warn("Users {} and {} are not friends", message.getSenderId(), message.getRecipientId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Return 403 if not friends
        }

        // If they are friends, proceed to send the message
        Message sentMessage = messageServiceClient.sendMessage(message);
        log.info("Message sent successfully: {}", sentMessage);
        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping("/between/{senderId}/{recipientId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long senderId, 
                                                     @PathVariable Long recipientId) {
        log.info("Fetching messages between sender: {} and recipient: {}", senderId, recipientId);
        
        // Check if users are friends before fetching messages
        List<User> friends = userService.findFriends(senderId);
        boolean isFriend = friends.stream().anyMatch(friend -> friend.getId().equals(recipientId));

        if (!isFriend) {
            log.warn("Users {} and {} are not friends", senderId, recipientId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Return 403 if not friends
        }

        try {
            List<Message> messages = messageServiceClient.getMessagesBetweenUsers(senderId, recipientId);
            log.info("Messages fetched successfully: {}", messages);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error fetching messages: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

