package org.sop.apigateway.models;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
public class Message {
    private Long id;
    private Long senderId;
    private Long recipientId;
    private String content;
    
    private LocalDateTime timestamp;
}
