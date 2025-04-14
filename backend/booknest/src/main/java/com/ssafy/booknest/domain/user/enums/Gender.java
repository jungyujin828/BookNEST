package com.ssafy.booknest.domain.user.enums;

public enum Gender {
    N, //설정안함
    M, //남자
    F, //여자
    O; //기타

    public String getName() {
        return this.name().toLowerCase();
    }
}
