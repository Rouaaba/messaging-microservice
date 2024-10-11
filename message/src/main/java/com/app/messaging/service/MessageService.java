package com.app.messaging.service;

import java.util.List;

import com.app.messaging.domain.Message;

public interface MessageService {
    void save(Message message);

    List<Message> getMessagesBetweenUsers(Long senderId, Long recipientId);

}
