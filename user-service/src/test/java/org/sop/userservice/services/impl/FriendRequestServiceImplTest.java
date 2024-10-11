package org.sop.userservice.services.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.sop.userservice.dtos.FriendRequestDto;
import org.sop.userservice.feignclients.ApiGatewayUserClient;
import org.sop.userservice.models.FriendRequest;
import org.sop.userservice.models.User;
import org.sop.userservice.repositories.FriendRequestRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FriendRequestServiceImplTest {

    @Mock
    private FriendRequestRepository friendRequestRepository;
    @Mock
    private ApiGatewayUserClient apiGatewayUserClient;

    @InjectMocks
    private FriendRequestServiceImpl friendRequestServiceImpl;

    @Test
    void deleteUserFriendRequests() {
        Long userId = 1L;

        friendRequestServiceImpl.deleteUserFriendRequests(userId);

        verify(friendRequestRepository, times(1)).deleteBySenderId(userId);
        verify(friendRequestRepository, times(1)).deleteByReceiverId(userId);
    }

    @Test
    void sendRequestReceiverExists() {
        Long senderId = 1L;
        Long receiverId = 2L;

        User receiver = new User();
        receiver.setId(receiverId);

        FriendRequest friendRequest = new FriendRequest(senderId, receiverId);
        friendRequest.setSentAt(LocalDate.now());

        when(apiGatewayUserClient.findById(receiverId)).thenReturn(receiver);
        when(friendRequestRepository.save(any(FriendRequest.class))).thenReturn(friendRequest);

        FriendRequest result = friendRequestServiceImpl.sendRequest(senderId, receiverId);

        assertEquals(friendRequest, result);
        verify(apiGatewayUserClient, times(1)).findById(receiverId);
        verify(friendRequestRepository, times(1)).save(any(FriendRequest.class));
    }

    @Test
    void sendRequestReceiverDoesNotExist() {
        Long senderId = 1L;
        Long receiverId = 2L;

        when(apiGatewayUserClient.findById(receiverId)).thenReturn(null);

        FriendRequest result = friendRequestServiceImpl.sendRequest(senderId, receiverId);

        assertNull(result);
        verify(apiGatewayUserClient, times(1)).findById(receiverId);
        verify(friendRequestRepository, never()).save(any(FriendRequest.class));
    }

    @Test
    void acceptRequestRequestExistsAndUserExists() {
        Long senderId = 1L;
        Long receiverId = 2L;

        FriendRequest friendRequest = new FriendRequest(senderId, receiverId);
        User sender = new User();
        sender.setId(senderId);

        when(friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId)).thenReturn(friendRequest);
        when(apiGatewayUserClient.findById(senderId)).thenReturn(sender);

        User result = friendRequestServiceImpl.acceptRequest(senderId, receiverId);

        assertEquals(sender, result);
        verify(friendRequestRepository, times(1)).findBySenderIdAndReceiverId(senderId, receiverId);
        verify(apiGatewayUserClient, times(1)).findById(senderId);
        verify(friendRequestRepository, times(1)).deleteBySenderIdAndReceiverId(senderId, receiverId);
        verify(apiGatewayUserClient, times(1)).addFriend(senderId, receiverId);
    }

    @Test
    void acceptRequestRequestDoesNotExist() {
        Long senderId = 1L;
        Long receiverId = 2L;

        User sender = new User();
        sender.setId(senderId);

        when(friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId)).thenReturn(null);
        when(apiGatewayUserClient.findById(senderId)).thenReturn(sender);

        User result = friendRequestServiceImpl.acceptRequest(senderId, receiverId);

        assertNull(result);
        verify(friendRequestRepository, times(1)).findBySenderIdAndReceiverId(senderId, receiverId);
        verify(apiGatewayUserClient, times(1)).findById(senderId);
        verify(friendRequestRepository, never()).deleteBySenderIdAndReceiverId(anyLong(), anyLong());
        verify(apiGatewayUserClient, never()).addFriend(anyLong(), anyLong());
    }

    @Test
    void acceptRequestUserDoesNotExist() {
        Long senderId = 1L;
        Long receiverId = 2L;

        FriendRequest friendRequest = new FriendRequest(senderId, receiverId);

        when(friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId)).thenReturn(friendRequest);
        when(apiGatewayUserClient.findById(senderId)).thenReturn(null);

        User result = friendRequestServiceImpl.acceptRequest(senderId, receiverId);

        assertNull(result);
        verify(friendRequestRepository, times(1)).findBySenderIdAndReceiverId(senderId, receiverId);
        verify(apiGatewayUserClient, times(1)).findById(senderId);
        verify(friendRequestRepository, never()).deleteBySenderIdAndReceiverId(anyLong(), anyLong());
        verify(apiGatewayUserClient, never()).addFriend(anyLong(), anyLong());
    }

    @Test
    void rejectRequest() {
        Long senderId = 1L;
        Long receiverId = 2L;

        friendRequestServiceImpl.rejectRequest(senderId, receiverId);

        verify(friendRequestRepository, times(1)).deleteBySenderIdAndReceiverId(senderId, receiverId);
    }
}
