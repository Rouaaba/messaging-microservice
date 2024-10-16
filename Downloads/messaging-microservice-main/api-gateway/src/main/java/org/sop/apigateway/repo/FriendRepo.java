package org.sop.apigateway.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.sop.apigateway.security.models.User;
import org.sop.apigateway.security.models.UserProjection;

public interface FriendRepo extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.id != :userId AND u NOT IN (SELECT f FROM User usr JOIN usr.friends f WHERE usr.id = :userId)")
    List<UserProjection> findUsersNotFriendsWith(@Param("userId") Long userId);

    Optional<User> findById(Long id);
}

