package org.sop.apigateway.controllers;

import org.sop.apigateway.dtos.FriendDto;
import org.sop.apigateway.feignclients.UserServiceFriendRequestClient;
import org.sop.apigateway.models.FriendRequest;
import org.sop.apigateway.repo.FriendRepo;
import org.sop.apigateway.security.models.UserProjection;
import org.sop.apigateway.services.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/user-service/api/friend-request")
public class UserServiceFriendRequestController {

    @Autowired
    private UserServiceFriendRequestClient userServiceFriendRequestClient;

    @Autowired
    private UserServiceImpl userServiceImpl;

    @Autowired
    private FriendRepo friendRepo;

   /* @GetMapping("/not-friends/{id}")
    public List<UserProjection> findUsersNotFriendsWith(@PathVariable Long id) {
        return friendRepo.findUsersNotFriendsWith(id);
    } */

    @GetMapping("/not-friends/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<UserProjection>> findUsersNotFriendsWith(@PathVariable Long id) {
        // Step 1: Get the list of users who are not friends
        List<UserProjection> notFriends = friendRepo.findUsersNotFriendsWith(id);
        
        // Step 2: Get the list of sent friend requests
        List<FriendRequest> sentRequests = userServiceFriendRequestClient.findBySenderId(id);
        Set<Long> sentRequestReceiverIds = sentRequests.stream()
                .map(FriendRequest::getReceiverId)
                .collect(Collectors.toSet()); // Collect receiver IDs into a Set

        // Step 3: Get the list of received friend requests
        List<FriendRequest> receivedRequests = userServiceFriendRequestClient.findByReceiverId(id);
        Set<Long> receivedRequestSenderIds = receivedRequests.stream()
                .map(FriendRequest::getSenderId)
                .collect(Collectors.toSet()); // Collect sender IDs into a Set

        // Step 4: Filter out users who are in sent or received requests
        List<UserProjection> filteredUsers = notFriends.stream()
                .filter(user -> !sentRequestReceiverIds.contains(user.getId()) && 
                                !receivedRequestSenderIds.contains(user.getId()))
                .collect(Collectors.toList());

        // Return the filtered list
        return ResponseEntity.ok(filteredUsers);
    }


    
    
    @GetMapping("/sent/{senderId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FriendRequest>> getSentRequests(@PathVariable Long senderId) {
        // Step 1: Get the list of friend requests
        List<FriendRequest> requests = userServiceFriendRequestClient.findBySenderId(senderId);
        
        // Step 2: Map requests to include receiver usernames
        for (FriendRequest request : requests) {
            String username = userServiceImpl.getUsernameById(request.getReceiverId());
            request.setReceiverUsername(username); // Set the receiver's username in the request
        }
        
        // Step 3: Return the modified list of friend requests
        return ResponseEntity.ok(requests);
    }


    @GetMapping("/received/{receiverId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FriendRequest>> getReceivedRequests(@PathVariable Long receiverId) {
        // Step 1: Get the list of friend requests received by the user
        List<FriendRequest> requests = userServiceFriendRequestClient.findByReceiverId(receiverId);
        
        // Step 2: Map requests to include sender usernames
        for (FriendRequest request : requests) {
            String senderUsername = userServiceImpl.getUsernameById(request.getSenderId());
            request.setSenderUsername(senderUsername); // Set the sender's username in the request
        }
        
        // Step 3: Return the modified list of friend requests
        return ResponseEntity.ok(requests);
    }


    @PostMapping("/{senderId}/{receiverId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FriendRequest> sendRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        try {
            FriendRequest request = userServiceFriendRequestClient.sendRequest(senderId, receiverId);
            return ResponseEntity.status(HttpStatus.CREATED).body(request);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        
    }

    @DeleteMapping("/accept/{senderId}/{receiverId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FriendDto> acceptRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        FriendDto friendDto = userServiceFriendRequestClient.acceptRequest(senderId, receiverId);
        return ResponseEntity.ok(friendDto);
    }

    @DeleteMapping("/reject/{senderId}/{receiverId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        userServiceFriendRequestClient.rejectRequest(senderId, receiverId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sent-invitations/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FriendRequest>> getSentInvitations(@PathVariable Long userId) {
        List<FriendRequest> invitations = userServiceFriendRequestClient.findSentInvitations(userId);
        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/received-invitations/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FriendRequest>> getReceivedInvitations(@PathVariable Long userId) {
        List<FriendRequest> invitations = userServiceFriendRequestClient.findReceivedInvitations(userId);
        return ResponseEntity.ok(invitations);
    }
}
