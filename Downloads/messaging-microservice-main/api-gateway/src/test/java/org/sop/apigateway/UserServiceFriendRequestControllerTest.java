package org.sop.apigateway;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sop.apigateway.controllers.UserServiceFriendRequestController;
import org.sop.apigateway.dtos.FriendDto;
import org.sop.apigateway.feignclients.UserServiceFriendRequestClient;
import org.sop.apigateway.models.FriendRequest;
import org.sop.apigateway.repo.FriendRepo;
import org.sop.apigateway.security.models.UserProjection;
import org.sop.apigateway.services.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import java.util.ArrayList;
import java.util.List;
import static org.mockito.ArgumentMatchers.anyLong;


public class UserServiceFriendRequestControllerTest {

    @InjectMocks
    private UserServiceFriendRequestController userServiceFriendRequestController;

    @Mock
    private UserServiceFriendRequestClient userServiceFriendRequestClient;

    @Mock
    private UserServiceImpl userServiceImpl;

    @Mock
    private FriendRepo friendRepo;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindUsersNotFriendsWith() {
        Long userId = 1L;
        List<UserProjection> notFriends = new ArrayList<>();

        when(friendRepo.findUsersNotFriendsWith(userId)).thenReturn(notFriends);
        when(userServiceFriendRequestClient.findBySenderId(userId)).thenReturn(new ArrayList<>());
        when(userServiceFriendRequestClient.findByReceiverId(userId)).thenReturn(new ArrayList<>());

        ResponseEntity<List<UserProjection>> response = userServiceFriendRequestController.findUsersNotFriendsWith(userId);

        verify(friendRepo, times(1)).findUsersNotFriendsWith(userId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(notFriends, response.getBody());
    }

    @Test
    public void testGetSentRequests() {
        Long senderId = 1L;
        List<FriendRequest> requests = new ArrayList<>();

        when(userServiceFriendRequestClient.findBySenderId(senderId)).thenReturn(requests);
        when(userServiceImpl.getUsernameById(anyLong())).thenReturn("TestUser");

        ResponseEntity<List<FriendRequest>> response = userServiceFriendRequestController.getSentRequests(senderId);

        verify(userServiceFriendRequestClient, times(1)).findBySenderId(senderId);
        for (FriendRequest request : requests) {
            verify(userServiceImpl, times(1)).getUsernameById(request.getReceiverId());
        }
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(requests, response.getBody());
    }

    @Test
    public void testGetReceivedRequests() {
        Long receiverId = 1L;
        List<FriendRequest> requests = new ArrayList<>();

        when(userServiceFriendRequestClient.findByReceiverId(receiverId)).thenReturn(requests);
        when(userServiceImpl.getUsernameById(anyLong())).thenReturn("TestSender");

        ResponseEntity<List<FriendRequest>> response = userServiceFriendRequestController.getReceivedRequests(receiverId);

        verify(userServiceFriendRequestClient, times(1)).findByReceiverId(receiverId);
        for (FriendRequest request : requests) {
            verify(userServiceImpl, times(1)).getUsernameById(request.getSenderId());
        }
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(requests, response.getBody());
    }

    @Test
    public void testSendRequest() {
        Long senderId = 1L;
        Long receiverId = 2L;
        FriendRequest request = new FriendRequest();

        when(userServiceFriendRequestClient.sendRequest(senderId, receiverId)).thenReturn(request);

        ResponseEntity<FriendRequest> response = userServiceFriendRequestController.sendRequest(senderId, receiverId);

        verify(userServiceFriendRequestClient, times(1)).sendRequest(senderId, receiverId);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(request, response.getBody());
    }

    @Test
    public void testAcceptRequest() {
        Long senderId = 1L;
        Long receiverId = 2L;
        FriendDto friendDto = new FriendDto();

        when(userServiceFriendRequestClient.acceptRequest(senderId, receiverId)).thenReturn(friendDto);

        ResponseEntity<FriendDto> response = userServiceFriendRequestController.acceptRequest(senderId, receiverId);

        verify(userServiceFriendRequestClient, times(1)).acceptRequest(senderId, receiverId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(friendDto, response.getBody());
    }

    @Test
    public void testRejectRequest() {
        Long senderId = 1L;
        Long receiverId = 2L;

        ResponseEntity<Void> response = userServiceFriendRequestController.rejectRequest(senderId, receiverId);

        verify(userServiceFriendRequestClient, times(1)).rejectRequest(senderId, receiverId);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    public void testGetSentInvitations() {
        Long userId = 1L;
        List<FriendRequest> invitations = new ArrayList<>();

        when(userServiceFriendRequestClient.findSentInvitations(userId)).thenReturn(invitations);

        ResponseEntity<List<FriendRequest>> response = userServiceFriendRequestController.getSentInvitations(userId);

        verify(userServiceFriendRequestClient, times(1)).findSentInvitations(userId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(invitations, response.getBody());
    }

    @Test
    public void testGetReceivedInvitations() {
        Long userId = 1L;
        List<FriendRequest> invitations = new ArrayList<>();

        when(userServiceFriendRequestClient.findReceivedInvitations(userId)).thenReturn(invitations);

        ResponseEntity<List<FriendRequest>> response = userServiceFriendRequestController.getReceivedInvitations(userId);

        verify(userServiceFriendRequestClient, times(1)).findReceivedInvitations(userId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(invitations, response.getBody());
    }
}