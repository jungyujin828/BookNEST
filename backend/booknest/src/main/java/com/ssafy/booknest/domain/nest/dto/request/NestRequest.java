package com.ssafy.booknest.domain.nest.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@NoArgsConstructor
public class NestRequest {
    @NotNull
    private Integer userId;
    @NotNull
    private Integer nestId;
}
