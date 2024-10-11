package com.app.messaging.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.messaging.domain.Message;
import com.app.messaging.repo.MessageRepo;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepo messageRepository;

    @Override
    public void save(Message message) {
        log.info("Saving message from user {} to user {}: {}", message.getSenderId(), message.getRecipientId(), message.getContent());
        messageRepository.save(message);
    }

    @Override
    public List<Message> getMessagesBetweenUsers(Long senderId, Long recipientId) {
        // Directly fetch messages without checking friendship
        return messageRepository.findMessagesBySenderIdAndRecipientId(senderId, recipientId);
    }
}

