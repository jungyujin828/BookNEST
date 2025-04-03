package com.ssafy.booknest.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FastApiResponse {
    private String db_status;
    private List<FastApiRecommendation> result;

    // Getters, Setters
}

