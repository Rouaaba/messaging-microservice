package org.sop.apigateway;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sop.apigateway.controllers.MessageGatewayController;
import org.sop.apigateway.feignclients.MessageServiceClient;
import org.sop.apigateway.models.Message;
import org.sop.apigateway.security.models.User;
import org.sop.apigateway.services.facade.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class MessageGatewayControllerTest {

    @InjectMocks
    private MessageGatewayController messageGatewayController;

    @Mock
    private MessageServiceClient messageServiceClient;

    @Mock
    private UserService userService;

    private Message testMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testMessage = new Message();
        testMessage.setSenderId(1L);
        testMessage.setRecipientId(2L);
        testMessage.setContent("Hello, friend!");
    }

    @Test
    void testSendMessage_Success() {
        User friend = new User();
        friend.setId(2L);
        when(userService.findFriends(testMessage.getSenderId())).thenReturn(Collections.singletonList(friend));
        when(messageServiceClient.sendMessage(any(Message.class))).thenReturn(testMessage);

        ResponseEntity<Message> response = messageGatewayController.sendMessage(testMessage);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testMessage, response.getBody());
        verify(messageServiceClient).sendMessage(testMessage);
    }

    @Test
    void testSendMessage_NotFriends() {
        when(userService.findFriends(testMessage.getSenderId())).thenReturn(Collections.emptyList());

        ResponseEntity<Message> response = messageGatewayController.sendMessage(testMessage);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(null, response.getBody());
        verify(messageServiceClient, never()).sendMessage(any(Message.class));
    }

    @Test
    void testGetMessages_Success() {
        User friend = new User();
        friend.setId(2L);
        when(userService.findFriends(1L)).thenReturn(Collections.singletonList(friend));
        Message message1 = new Message();
        message1.setContent("Hello");
        Message message2 = new Message();
        message2.setContent("How are you?");
        when(messageServiceClient.getMessagesBetweenUsers(1L, 2L)).thenReturn(Arrays.asList(message1, message2));

        ResponseEntity<List<Message>> response = messageGatewayController.getMessages(1L, 2L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(messageServiceClient).getMessagesBetweenUsers(1L, 2L);
    }

    @Test
    void testGetMessages_NotFriends() {
        when(userService.findFriends(1L)).thenReturn(Collections.emptyList());

        ResponseEntity<List<Message>> response = messageGatewayController.getMessages(1L, 2L);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(null, response.getBody());
        verify(messageServiceClient, never()).getMessagesBetweenUsers(any(Long.class), any(Long.class));
    }
    
    @Test
    void testGetMessages_ErrorFetching() {
        User friend = new User();
        friend.setId(2L);
        when(userService.findFriends(1L)).thenReturn(Collections.singletonList(friend));
        when(messageServiceClient.getMessagesBetweenUsers(1L, 2L)).thenThrow(new RuntimeException("Error fetching messages"));

        ResponseEntity<List<Message>> response = messageGatewayController.getMessages(1L, 2L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(null, response.getBody());
    }
}
