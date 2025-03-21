import React from 'react';

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

const InputInfoPage = () => {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("설정안함");
  const [birthdate, setBirthdate] = useState(""); // 8자리 생년월일 (YYYYMMDD)
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setNickname(text);
    // Validate nickname (example: max 10 characters)
    setIsNicknameValid(text.length <= 10);
  };

  const handleFindAddress = () => {
    // 주소 검색 기능 구현
    console.log("주소 찾는 중...");
  };

  // 생년월일 입력 처리 함수
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 생년월일 포맷팅 (YYYYMMDD -> YYYY-MM-DD)
    let formattedBirthdate = "";
    if (birthdate.length === 8) {
      const year = birthdate.substring(0, 4);
      const month = birthdate.substring(4, 6);
      const day = birthdate.substring(6, 8);
      formattedBirthdate = `${year}-${month}-${day}`;
    }

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
        birthdate: formattedBirthdate,
        address: {
          zipcode: address.split(" ")[0],
          road_address: detailAddress ? `${address} ${detailAddress}` : address,
        },
        updated_at: new Date().toISOString().replace("T", " ").substring(0, 19),
      },
    };

    try {
      // Get token from localStorage or wherever it's stored
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("로그인이 필요한 서비스입니다.");
        return;
      }

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success - maybe redirect or show success message
        console.log("회원 정보가 성공적으로 업데이트되었습니다.");
        // Redirect or show success message
      } else {
        // Handle error responses
        setErrorMessage(
          data.error.message || "회원 정보 업데이트에 실패했습니다."
        );
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      setErrorMessage(
        "서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
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
          {!isNicknameValid && (
            <ErrorText>사용할 수 없는 닉네임입니다</ErrorText>
          )}
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
            <AddressInput
              type="text"
              placeholder="우편번호를 검색해주세요"
              value={address}
              readOnly
            />
            <AddressButton type="button" onClick={handleFindAddress}>
              우편번호 찾기
            </AddressButton>
          </AddressRow>

          <FullInput
            type="text"
            placeholder="기본주소"
            value={address}
            readOnly
          />

          <FullInput
            type="text"
            placeholder="상세주소를 입력해주세요"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </InputGroup>

        <SubmitButton type="submit">정보 입력 완료</SubmitButton>
      </form>
    </Container>
  );
};

export default InputInfoPage;