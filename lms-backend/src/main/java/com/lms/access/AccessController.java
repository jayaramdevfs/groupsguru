package com.lms.access;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.lms.auth.User;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/access")
@RequiredArgsConstructor
public class AccessController {
    
    private final AccessService accessService;

    @GetMapping("/check/{entityType}/{entityId}")
    public AccessCheckResponse checkAccess(
            @AuthenticationPrincipal User user,
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        Long userId = user != null ? user.getId() : null;
        return accessService.checkAccess(userId, entityType, entityId);
    }
}
