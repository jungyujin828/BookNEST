package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.enums.AgeGroup;
import com.ssafy.booknest.domain.user.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AgeGenderBookResult {

    private String description;
    private List<AgeGenderBookResponse> books;

    public static AgeGenderBookResult of(List<AgeGenderBookResponse> responses) {
        if (responses == null || responses.isEmpty()) {
            return new AgeGenderBookResult("랜덤 추천 도서입니다.", List.of());
        }

        AgeGroup ageGroup = responses.get(0).getAgeGroup();
        Gender gender = responses.get(0).getGender();

        StringBuilder desc = new StringBuilder();

        if (ageGroup != null && gender != null && gender != Gender.N && gender != Gender.O) {
            desc.append(ageGroup.getLabel()).append(" ").append(convertGenderToKorean(gender)).append("이 좋아하는 책");
        } else if (ageGroup != null) {
            desc.append(ageGroup.getLabel()).append(" 연령대가 좋아하는 책");
        } else if (gender != null && gender != Gender.N && gender != Gender.O) {
            desc.append(convertGenderToKorean(gender)).append("이 좋아하는 책");
        } else {
            desc.append("랜덤 추천 도서입니다.");
        }


        return new AgeGenderBookResult(desc.toString(), responses);
    }

    private static String convertGenderToKorean(Gender gender) {
        return switch (gender) {
            case M -> "남성";
            case F -> "여성";
            default -> ""; // N, O 처리 안 함
        };
    }

}
