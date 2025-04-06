import React, { useEffect } from "react";
import styled from "@emotion/styled";

interface SearchTagProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onClearTags: () => void;
  onSearch: () => void;
}

// 태그 카테고리 정의
const tagCategories = {
  장르: [
    "판타지",
    "SF",
    "미스터리",
    "스릴러",
    "공포",
    "로맨스",
    "역사소설",
    "모험",
    "코미디",
    "블랙 코미디",
    "드라마",
    "범죄",
    "서스펜스",
  ],
  분위기: [
    "감동적인",
    "잔잔한",
    "긴장감 있는",
    "우울한",
    "유머러스한",
    "어두운",
    "밝고 긍정적",
    "철학적",
    "역동적인",
    "몽환적인",
    "역설적인",
    "잔혹한",
    "황홀한",
    "불안감을 조성하는",
    "낭만적인",
    "냉소적인",
    "초현실적인",
  ],
  주제: [
    "사회 비판적",
    "불평등",
    "젠더 문제",
    "전쟁과 평화",
    "운명과 자유의지",
    "도덕적 딜레마",
    "혁명과 저항",
    "환경과 생태",
    "의료 및 바이오테크",
    "외교와 정치 음모",
    "권력과 부패",
    "노동과 계급투쟁",
    "이민과 정체성",
    "문화 충돌",
    "무정부주의",
    "전통과 혁신",
    "인공지능과 정보화",
    "가족 드라마",
    "스포츠",
  ],
  테마: [
    "성장 이야기",
    "트라우마와 치유",
    "우정과 동료애",
    "종교적·영적 요소",
    "복수와 정의",
    "정체성 탐색",
    "내면 탐구",
    "기억과 시간",
    "이중성",
    "금기와 반항",
    "실존적 고민",
    "욕망과 타락",
    "재난·서바이벌",
    "저널리즘",
  ],
  스페셜: [
    "의식의 흐름",
    "미완의 이야기",
    "실험적 문체",
    "형식 파괴적",
    "독특한 서술 방식",
    "대체 역사",
    "비선형 서사",
    "스토리텔링",
  ],
  세계관: [
    "디스토피아",
    "유토피아",
    "포스트 아포칼립스",
    "사이버펑크",
    "다중 우주",
    "시간 여행",
    "초현실적 공간",
    "미지의 영역 탐험",
    "이세계",
    "신화적 세계",
    "가상 현실",
    "기후 변화 세계",
  ],
};

const SearchTag: React.FC<SearchTagProps> = ({
  selectedTags,
  onTagSelect,
  onClearTags,
  onSearch,
}) => {
  const handleTagSelect = (tag: string) => {
    console.log("Tag Selected:", tag);
    console.log("Current Selected Tags:", selectedTags);
    onTagSelect(tag);
    console.log("After Selection - Selected Tags:", selectedTags);
    // onSearch() 제거
  };

  const handleClearTags = () => {
    console.log("Clearing all tags");
    onClearTags();
    onSearch();
  };
  return (
    <TagSection>
      {Object.entries(tagCategories).map(([category, tags]) => (
        <TagCategory key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <TagList>
            {tags.map((tag) => (
              <TagButton
                key={tag}
                selected={selectedTags.includes(tag)}
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </TagButton>
            ))}
          </TagList>
        </TagCategory>
      ))}
      {selectedTags.length > 0 && (
        <SelectedTagsContainer>
          {selectedTags.map((tag) => (
            <SelectedTag key={tag} onClick={() => handleTagSelect(tag)}>
              {tag} ×
            </SelectedTag>
          ))}
          <ClearTagsButton onClick={handleClearTags}>전체 해제</ClearTagsButton>
        </SelectedTagsContainer>
      )}
    </TagSection>
  );
};

const TagSection = styled.div`
  margin: 20px 0;
`;

const TagCategory = styled.div`
  margin-bottom: 16px;
`;

const CategoryTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagButton = styled.button<{ selected: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.selected ? "#7bc47f" : "#ddd")};
  background-color: ${(props) => (props.selected ? "#f0f8f1" : "white")};
  color: ${(props) => (props.selected ? "#7bc47f" : "#666")};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${(props) => (props.selected ? "#e5f2e7" : "#f8f9fa")};
  }
`;

const SelectedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

const SelectedTag = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  background-color: #f0f8f1;
  color: #7bc47f;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #e5f2e7;
  }
`;

const ClearTagsButton = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #f8f9fa;
  }
`;

export default SearchTag;
