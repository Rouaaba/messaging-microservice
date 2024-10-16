package org.sop.apigateway;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.sop.apigateway.controllers.UserController;
import org.sop.apigateway.dtos.UserDto;
import org.sop.apigateway.security.models.User;
import org.sop.apigateway.services.facade.UserService;
import java.time.LocalDate;


@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setUp() {
        assertNotNull(userController);
        assertNotNull(userService);
        assertNotNull(modelMapper);
    }

    @Test
    public void testFindByIdSuccess() {
        Long userId = 1L;
        User user = new User("test_user", "test@email.com", "...", "John", "Doe", LocalDate.of(2000, 1, 1), LocalDate.now(), "+1234567890", true);
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getFirstname(), user.getLastname(), user.getBirthdate(), user.getCreatedAt(), user.getPhoneNumber(), user.getBio(), user.getImage(), user.isEnabled());

        when(userService.findById(userId)).thenReturn(user);
        when(modelMapper.map(user, UserDto.class)).thenReturn(userDto);

        UserDto foundUserDto = userController.findById(userId);

        assertNotNull(foundUserDto);
        assertEquals(userDto, foundUserDto);
    }

    @Test
    public void testFindByIdNotFound() {
        Long userId = 1L;

        when(userService.findById(userId)).thenReturn(null);

        UserDto foundUserDto = userController.findById(userId);

        assertNull(foundUserDto);
    }

    @Test
    public void testUpdateSuccess() {
        UserDto userDto = new UserDto(1L, "updated_username", "...", "John", "Doe", LocalDate.of(2000, 1, 1), LocalDate.now(), "+1234567890", "updated bio", null, true);
        User user = new User(userDto.getUsername(), "...", "...", userDto.getFirstname(), userDto.getLastname(), userDto.getBirthdate(), userDto.getCreatedAt(), userDto.getPhoneNumber(), userDto.isEnabled());

        when(modelMapper.map(userDto, User.class)).thenReturn(user);
        when(userService.update(user)).thenReturn(user);
        when(modelMapper.map(user, UserDto.class)).thenReturn(userDto);

        UserDto updatedUserDto = userController.update(userDto);

        assertNotNull(updatedUserDto);
        assertEquals(userDto, updatedUserDto);
    }

    @Test
    public void testUpdateFail() {
        UserDto userDto = new UserDto(1L, "updated_username", "...", "John", "Doe", LocalDate.of(2000, 1, 1), LocalDate.now(), "+1234567890", "updated bio", null, true);

        when(modelMapper.map(userDto, User.class)).thenReturn(new User());
        when(userService.update(any(User.class))).thenReturn(null);

        UserDto updatedUserDto = userController.update(userDto);

        assertNull(updatedUserDto);
    }

    @Test
    public void testAddFriendSuccess() {
        Long userId1 = 1L;
        Long userId2 = 2L;

        when(userService.addFriend(userId1, userId2)).thenReturn(true);

        boolean added = userController.addFriend(userId1, userId2);

        assertTrue(added);
    }
}