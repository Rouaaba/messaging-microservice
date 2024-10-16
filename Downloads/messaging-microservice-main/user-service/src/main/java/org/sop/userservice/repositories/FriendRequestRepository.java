package org.sop.userservice.repositories;

import org.sop.userservice.models.FriendRequest;
import org.sop.userservice.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    FriendRequest findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    List<FriendRequest> findBySenderIdOrderBySentAtDesc(Long senderId);

    List<FriendRequest> findByReceiverIdOrderBySentAtDesc(Long receiverId);

    int deleteBySenderIdAndReceiverId(Long senderId, Long receiverId);

    int deleteBySenderId(Long senderId);

    int deleteByReceiverId(Long receiverId);

    @Query("SELECT CASE WHEN fr.receiverId = :userId THEN fr.senderId ELSE fr.receiverId END " +
           "FROM FriendRequest fr " +
           "WHERE fr.senderId = :userId OR fr.receiverId = :userId")
    List<Long> findFriendIdsByUserId(@Param("userId") Long userId);
}
