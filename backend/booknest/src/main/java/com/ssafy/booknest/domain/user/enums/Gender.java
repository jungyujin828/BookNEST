package com.ssafy.booknest.domain.user.enums;

public enum Gender {
    M, //남자
    F, //여자
    O; //기타

    public String getName() {
        return this.name().toLowerCase();
    }
}
