package com.amo11k.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;

    private String avatarUrl;
}
