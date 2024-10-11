package com.app.messaging.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.app.messaging.domain.Message;
import com.app.messaging.service.MessageService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/messages")
@Slf4j
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        log.info("Received message request: {}", message);
        
        // Ensure senderId and recipientId are not null
        if (message.getSenderId() == null || message.getRecipientId() == null) {
            return ResponseEntity.badRequest().build(); // Return bad request if IDs are null
        }

        messageService.save(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(message); // Return 201 Created
    }

    @GetMapping("/between/{senderId}/{recipientId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long senderId, @PathVariable Long recipientId) {
        try {
            List<Message> messages = messageService.getMessagesBetweenUsers(senderId, recipientId);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            log.error("Error fetching messages between users {} and {}: {}", senderId, recipientId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Return 403 Forbidden if users are not friends
        }
    }
}