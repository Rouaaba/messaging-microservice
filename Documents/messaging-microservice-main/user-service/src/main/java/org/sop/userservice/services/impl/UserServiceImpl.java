package org.sop.userservice.services.impl;

import org.sop.userservice.feignclients.*;
import org.sop.userservice.services.facade.FriendRequestService;
import org.sop.userservice.services.facade.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private FriendRequestService friendRequestService;
    @Autowired
    private ApiGatewayUserClient apiGatewayUserClient;



    public void deleteUser(Long id) {
        friendRequestService.deleteUserFriendRequests(id);
        apiGatewayUserClient.deleteById(id);
    }
}
