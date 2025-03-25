import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';  // api 인스턴스 import 추가

// Daum Postcode API 타입 선언
declare global {
  interface Window {
    daum: {
      Postcode: new (config: any) => any;
    };
  }
}

// 스타일 컴포넌트 정의
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Required = styled.span`
  color: #ff0000;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 15px;
  color: #000000;
  font-size: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const FullInput = styled(Input)`
  width: 100%;
  margin-top: 10px;
`;

const ConfirmButton = styled.button`
  background-color: #7bc47f;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: #ff0000;
  margin-top: 5px;
`;

const SelectContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
`;

const Select = styled.select`
  width: 100%;
  height: 50px;
  border: none;
  outline: none;
  background-color: #ffffff;
  padding: 0 15px;
  color: #000000;
  font-size: 16px;
  box-sizing: border-box;
`;

const AddressRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AddressInput = styled.input`
  flex: 1;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 15px;
  font-size: 16px;
  background-color: #ffffff;
`;

const AddressButton = styled.button`
  background-color: #7bc47f;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;

const EvaluateButton = styled.button`
  width: 100%;
  background-color: #4a90e2;
  padding: 15px;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #7bc47f;
  padding: 15px;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 50px;
`;

// BirthDateContainer와 관련 스타일 컴포넌트 대신 새로운 스타일 컴포넌트 정의
const BirthDateInput = styled.input`
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 15px;
  color: #000000;
  font-size: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const AddressModal = styled.div`
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const AddressModalContent = styled.div`
  background-color: white;
  padding: 20px;
  height: 70%;
  border-radius: 5px;
  overflow: visible;
  position: relative;
`;

const CloseButton = styled.button`
  position: relative;
  rigjt: 0;
  border: none;
  background-color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  color: #000000;
`;

const InputInfoPage = () => {
  const navigate = useNavigate(); // 추가: useNavigate 훅 선언
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("설정안함");
  const [birthdate, setBirthdate] = useState(""); // 8자리 생년월일 (YYYYMMDD)
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [zipcode, setZipcode] = useState(""); // 우편번호 상태 추가
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Daum Postcode 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setNickname(text);
    // Validate nickname (example: max 10 characters)
    setIsNicknameValid(text.length <= 10);
  };

  const handleFindAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  // Daum Postcode 실행 함수
  const execDaumPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          // 우편번호와 주소 정보 가져오기
          const zonecode = data.zonecode; // 우편번호
          let fullAddress = data.roadAddress || data.jibunAddress; // 도로명 주소 우선, 없으면 지번 주소
          let extraAddress = "";

          // 법정동명이 있을 경우 추가
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddress += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddress += extraAddress !== "" ? ", " + data.buildingName : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우 괄호까지 추가한 최종 문자열 생성
          if (extraAddress !== "") {
            fullAddress += ` (${extraAddress})`;
          }

          // 주소 정보 설정
          setZipcode(zonecode);
          setAddress(fullAddress);
          setIsAddressModalOpen(false);

          // 상세주소 입력 필드로 포커스 이동
          document.getElementById("detailAddress")?.focus();
        },
      }).embed(document.getElementById("addressLayer") as HTMLElement);
    }
  };

  // 주소 모달이 열릴 때 Daum Postcode 실행
  useEffect(() => {
    if (isAddressModalOpen) {
      execDaumPostcode();
    }
  }, [isAddressModalOpen]);

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 검증
    if (value === "" || /^\d+$/.test(value)) {
      // 최대 8자리까지만 입력 가능
      if (value.length <= 8) {
        setBirthdate(value);
      }
    }
  };

  const formatBirthdate = (date: string): string => {
    if (date.length !== 8) return "";
    return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format gender to match API requirements
    let genderCode;
    if (gender === "남성") {
      genderCode = "M";
    } else if (gender === "여성") {
      genderCode = "F";
    } else if (gender === "기타") {
      genderCode = "O";
    } else {
      genderCode = ""; // 설정안함은 빈 문자열
    }

    // Create request payload
    const payload = {
      data: {
        nickname,
        gender: genderCode,
        birthdate: formatBirthdate(birthdate),
        address: {
          zipcode: zipcode,
          road_address: detailAddress ? `${address} ${detailAddress}` : address,
        },
        updated_at: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
    };

    try {
      const response = await api.put('/user/update', payload);

      if (response.data.success) {
        // Handle success - maybe redirect or show success message
        console.log("회원 정보가 성공적으로 업데이트되었습니다.");
        // Redirect or show success message
      } else {
        // Handle error responses
        setErrorMessage(response.data.error?.message || "회원 정보 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      setErrorMessage("서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Title>회원정보 입력</Title>
      <Subtitle>추가 정보를 입력하여 북네스트를 시작해보세요!</Subtitle>

      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>
            닉네임<Required>*</Required>
          </Label>
          <InputRow>
            <Input
              type="text"
              placeholder="사용하실 닉네임을 입력해주세요"
              value={nickname}
              onChange={handleNicknameChange}
            />
            <ConfirmButton type="button">중복 확인</ConfirmButton>
          </InputRow>
          {!isNicknameValid && <ErrorText>사용할 수 없는 닉네임입니다</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>성별</Label>
          <SelectContainer>
            <Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="설정안함">선택해주세요</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
              <option value="기타">기타</option>
            </Select>
          </SelectContainer>
        </InputGroup>

        <InputGroup>
          <Label>생년월일</Label>
          <BirthDateInput
            type="text"
            placeholder="생년월일 8자리를 입력해주세요 (예: 19990101)"
            value={birthdate}
            onChange={handleBirthdateChange}
            maxLength={8}
          />
        </InputGroup>

        <InputGroup>
          <Label>주소</Label>
          <AddressRow>
            <AddressInput type="text" placeholder="주소를 검색해주세요" value={address} readOnly />
            <AddressButton type="button" onClick={handleFindAddress}>
              주소 검색
            </AddressButton>
          </AddressRow>
          <FullInput
            type="text"
            placeholder="상세 주소를 입력해주세요"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </InputGroup>

        <EvaluateButton type="button" onClick={() => navigate("/eval-book")}>
          도서 평가하러 가기
        </EvaluateButton>

        <SubmitButton type="submit">정보 입력 완료</SubmitButton>
      </form>

      {isAddressModalOpen && (
        <AddressModal>
          <AddressModalContent>
            <CloseButton onClick={handleCloseAddressModal}>×</CloseButton>
            <div id="addressLayer" style={{ width: "100%", height: "400px" }}></div>
          </AddressModalContent>
        </AddressModal>
      )}
    </Container>
  );
};

export default InputInfoPage;
