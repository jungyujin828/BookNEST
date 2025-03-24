package com.ssafy.booknest.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookPurchaseResponse {
    private String aladinUrl;
    private String kyoboUrl;
    private String yes24Url;
}
