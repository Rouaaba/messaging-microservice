package org.sop.userservice.services.impl;

import org.sop.userservice.feignclients.ApiGatewayUserClient;
import org.sop.userservice.models.FriendRequest;
import org.sop.userservice.models.User;
import org.sop.userservice.repositories.FriendRequestRepository;
import org.sop.userservice.services.facade.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
public class FriendRequestServiceImpl implements FriendRequestService {
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    @Autowired
    private ApiGatewayUserClient apiGatewayUserClient;

    public List<FriendRequest> findBySenderId(Long senderId) {
        return friendRequestRepository.findBySenderIdOrderBySentAtDesc(senderId);
    }

    public List<FriendRequest> findByReceiverId(Long receiverId) {
        return friendRequestRepository.findByReceiverIdOrderBySentAtDesc(receiverId);
    }

    @Transactional
    public void deleteUserFriendRequests(Long id) {
        friendRequestRepository.deleteBySenderId(id);
        friendRequestRepository.deleteByReceiverId(id);
    }

    public FriendRequest sendRequest(Long senderId, Long receiverId) {
        User user = apiGatewayUserClient.findById(receiverId);
        if (user == null) return null;
        FriendRequest friendRequest = new FriendRequest(senderId, receiverId);
        friendRequest.setSentAt(LocalDate.now());
        return friendRequestRepository.save(friendRequest);
    }

    @Transactional
    public User acceptRequest(Long senderId, Long receiverId) {
        log.info("Checking friend request for senderId: {} and receiverId: {}", senderId, receiverId);
        
        // Find the friend request
        FriendRequest friendRequest = friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId);
        
        // Log the found friend request
        log.info("Found friend request: {}", friendRequest);
        
        // Ensure user exists
        User user = apiGatewayUserClient.findById(senderId);
        if (friendRequest == null || user == null) {

            log.warn("User with senderId: {} not found.", senderId);
            return null;
        }   
        // Delete the friend request
        friendRequestRepository.deleteBySenderIdAndReceiverId(senderId, receiverId);
        boolean added = apiGatewayUserClient.addFriend(senderId, receiverId);
        log.info("Friend added: {}", added);
        if (!added) {
            log.error("Failed to add friend with senderId: {} and receiverId: {}", senderId, receiverId);
        }
        return user;
    }

    @Transactional
    public void rejectRequest(Long senderId, Long receiverId) {
        friendRequestRepository.deleteBySenderIdAndReceiverId(senderId, receiverId);
    }
}