package org.sop.userservice.controllers;

import org.modelmapper.ModelMapper;
import org.sop.userservice.dtos.FriendRequestDto;
import org.sop.userservice.models.Friend;
import org.sop.userservice.models.FriendRequest;
import org.sop.userservice.models.User;
import org.sop.userservice.services.facade.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friend-request")
public class FriendRequestController {
    @Autowired
    private FriendRequestService friendRequestService;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/sent-friend-requests/{senderId}")
    public List<FriendRequestDto> findBySenderId(@PathVariable Long senderId) {
        List<FriendRequest> friendRequests = friendRequestService.findBySenderId(senderId);
        List<FriendRequestDto> friendRequestDtos = new ArrayList<>();
        for (FriendRequest friendRequest : friendRequests) {
            FriendRequestDto friendRequestDto = modelMapper.map(friendRequest, FriendRequestDto.class);
            friendRequestDtos.add(friendRequestDto);
        }
        return friendRequestDtos;
    }


    @GetMapping("/received-friend-requests/{receiverId}")
    public List<FriendRequestDto> findByReceiverId(@PathVariable Long receiverId) {
        List<FriendRequest> friendRequests = friendRequestService.findByReceiverId(receiverId);
        List<FriendRequestDto> friendRequestDtos = new ArrayList<>();
        for (FriendRequest friendRequest : friendRequests) {
            FriendRequestDto friendRequestDto = modelMapper.map(friendRequest, FriendRequestDto.class);
            friendRequestDtos.add(friendRequestDto);
        }
        return friendRequestDtos;
    }


    @PostMapping("/{senderId}/{receiverId}")
    public FriendRequestDto sendRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        FriendRequest friendRequest = friendRequestService.sendRequest(senderId, receiverId);
        if (friendRequest == null) return null;
        return modelMapper.map(friendRequest, FriendRequestDto.class);
    }

    @DeleteMapping("/accept/{senderId}/{receiverId}")
    public Friend acceptRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        User user = friendRequestService.acceptRequest(senderId, receiverId);
        if (user == null) return null;
        return modelMapper.map(user, Friend.class);
    }

    @DeleteMapping("/reject/{senderId}/{receiverId}")
    public void rejectRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        friendRequestService.rejectRequest(senderId, receiverId);
    }

    @GetMapping("/sent-invitations/{userId}")
    public List<FriendRequestDto> findSentInvitations(@PathVariable Long userId) {
        List<FriendRequest> friendRequests = friendRequestService.findBySenderId(userId);
        List<FriendRequestDto> friendRequestDtos = new ArrayList<>();
        for (FriendRequest friendRequest : friendRequests) {
            FriendRequestDto friendRequestDto = modelMapper.map(friendRequest, FriendRequestDto.class);
            friendRequestDtos.add(friendRequestDto);
        }
        return friendRequestDtos;
    }
    // New method to get received invitations
    @GetMapping("/received-invitations/{userId}")
    public List<FriendRequestDto> findReceivedInvitations(@PathVariable Long userId) {
        List<FriendRequest> friendRequests = friendRequestService.findByReceiverId(userId);
        List<FriendRequestDto> friendRequestDtos = new ArrayList<>();
        for (FriendRequest friendRequest : friendRequests) {
            FriendRequestDto friendRequestDto = modelMapper.map(friendRequest, FriendRequestDto.class);
            friendRequestDtos.add(friendRequestDto);
        }
        return friendRequestDtos;
    }

}
