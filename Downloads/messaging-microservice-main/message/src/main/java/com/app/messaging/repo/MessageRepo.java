package com.app.messaging.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.messaging.domain.Message;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message, Integer> {
    @Query("SELECT m FROM Message m WHERE (m.senderId = :senderId AND m.recipientId = :recipientId) OR (m.senderId = :recipientId AND m.recipientId = :senderId)")
    List<Message> findMessagesBySenderIdAndRecipientId(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);

}


