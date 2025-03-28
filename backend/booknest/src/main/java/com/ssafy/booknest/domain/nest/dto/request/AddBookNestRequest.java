package com.ssafy.booknest.domain.nest.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class AddBookNestRequest {
    @NotNull
    private Integer bookId;
    @NotNull
    private Integer nestId;

    private Double rating;

    private String review;
}
